const Valuation = require('../models/Valuation');
const Listing = require('../models/Listing');
const asyncHandler = require('../middleware/asyncHandler');

// PKR per SqFt base land+construction rates (heuristic, 2026)
const CITY_RATES = {
  lahore: 8500,
  karachi: 12000,
  islamabad: 14000,
  rawalpindi: 7000,
  gujranwala: 5000,
  faisalabad: 5000,
  sialkot: 5000,
  multan: 4500,
  peshawar: 4500,
  quetta: 4000,
};
const DEFAULT_RATE = 5000;

const TYPE_MULTIPLIER = { House: 1.15, Plot: 1.0, Commercial: 2.2 };

const UNIT_TO_SQFT = { Marla: 272.25, Kanal: 5445, SqFt: 1 };

// POST /api/valuations — estimate + save lead
exports.createValuation = asyncHandler(async (req, res) => {
  const { city, society, propertyType, size, sizeUnit, purpose, name, phone, email } = req.body;

  const sizeNum = Number(size);
  if (!sizeNum || sizeNum <= 0) {
    return res.status(400).json({ success: false, message: 'Valid size is required' });
  }

  const sizeSqft = sizeNum * UNIT_TO_SQFT[sizeUnit];

  // 1) Try real market data: avg price-per-sqft of active listings in same society
  let ratePerSqft = null;
  const comparables = await Listing.aggregate([
    {
      $match: {
        status: 'Active',
        purpose: purpose || 'Sale',
        society: { $regex: society, $options: 'i' },
      },
    },
    {
      $group: {
        _id: null,
        avgPrice: { $avg: '$price' },
        avgSize: { $avg: '$size' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (comparables.length > 0 && comparables[0].count >= 2) {
    const { avgPrice, avgSize } = comparables[0];
    // Convert avg listing size to sqft (assume same unit mix — use per-listing sqft via unit field is complex; use society avg directly)
    ratePerSqft = avgPrice / (avgSize * UNIT_TO_SQFT.Marla); // most listings are Marla-based
  }

  // 2) Fallback: city heuristic
  if (!ratePerSqft || !isFinite(ratePerSqft)) {
    const cityKey = (city || '').toLowerCase().trim();
    ratePerSqft = CITY_RATES[cityKey] || DEFAULT_RATE;
  }

  ratePerSqft *= TYPE_MULTIPLIER[propertyType] || 1;

  // Estimate range ±12%
  const mid = Math.round(ratePerSqft * sizeSqft);
  const low = Math.round(mid * 0.88);
  const high = Math.round(mid * 1.12);

  const monthlyRentEstimate =
    purpose === 'Rent' ? Math.round(mid * 0.004) : null;

  const valuation = await Valuation.create({
    city,
    society,
    propertyType,
    size: sizeNum,
    sizeUnit,
    purpose: purpose || 'Sale',
    estimateLow: purpose === 'Rent' ? Math.round(low * 0.004) : low,
    estimateHigh: purpose === 'Rent' ? Math.round(high * 0.004) : high,
    estimateMid: monthlyRentEstimate || mid,
    name,
    phone,
    email,
  });

  res.status(201).json({
    success: true,
    valuation,
    estimate: {
      low: valuation.estimateLow,
      high: valuation.estimateHigh,
      mid: valuation.estimateMid,
      currency: 'PKR',
      basis: comparables.length > 0 && comparables[0].count >= 2
        ? 'market-comparables'
        : 'city-heuristic',
      monthlyRentEstimate,
    },
  });
});

// Admin: list valuation leads
exports.getValuations = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [valuations, total] = await Promise.all([
    Valuation.find(query).sort('-createdAt').skip(skip).limit(limitNum).lean(),
    Valuation.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    valuations,
    total,
    totalPages: Math.ceil(total / limitNum),
    page: pageNum,
  });
});