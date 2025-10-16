import { aggregateProfile, fetchRandomUser } from '../services/aggregator.service.mjs';

export const getFullProfile = async (req, res) => {
  try {
    const profile = await aggregateProfile();
    res.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getRandomUser = async (req, res) => {
  try {
    const user = await fetchRandomUser();
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getBatchProfiles = async (req, res) => {
  try {
    const count = Math.min(parseInt(req.params.count) || 1, 10);
    const profiles = await Promise.all(
      Array(count).fill().map(() => aggregateProfile())
    );
    
    res.json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};