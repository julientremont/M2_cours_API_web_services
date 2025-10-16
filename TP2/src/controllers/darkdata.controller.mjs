import {
  calculateGlobalStats,
  calculateRiskScore,
  analyzeDemographics,
  calculatePredictiveScore
} from '../services/darkdata.service.mjs';


export const getGlobalStats = async (req, res) => {
  try {
    const stats = await calculateGlobalStats();
    res.json({
      success: true,
      darkData: 'Global Aggregation Statistics',
      description: 'Métriques calculées sur toutes les sources',
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getRiskScore = async (req, res) => {
  try {
    const riskData = await calculateRiskScore();
    res.json({
      success: true,
      darkData: 'Financial Risk Score',
      description: 'Score de risque calculé à partir des données agrégées',
      data: riskData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getDemographicAnalysis = async (req, res) => {
  try {
    const demographics = await analyzeDemographics();
    res.json({
      success: true,
      darkData: 'Demographic Analysis',
      description: 'Tendances et corrélations démographiques',
      data: demographics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPredictiveScore = async (req, res) => {
  try {
    const predictive = await calculatePredictiveScore();
    res.json({
      success: true,
      darkData: 'Predictive Behavior Score',
      description: 'Prédictions comportementales basées sur ML',
      data: predictive
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
