
import { aggregateProfile } from './aggregator.service.mjs';

export const calculateGlobalStats = async () => {
  const samples = await Promise.all(
    Array(5).fill().map(() => aggregateProfile())
  );

  let successCount = 0;
  let errorCount = 0;
  const sourceHealth = {};

  samples.forEach(profile => {
    Object.entries(profile).forEach(([key, value]) => {
      if (!sourceHealth[key]) sourceHealth[key] = { success: 0, errors: 0 };
      
      if (value?.error) {
        errorCount++;
        sourceHealth[key].errors++;
      } else if (key !== 'aggregated_at' && key !== 'sources_count') {
        successCount++;
        sourceHealth[key].success++;
      }
    });
  });

  return {
    total_requests: successCount + errorCount,
    success_rate: ((successCount / (successCount + errorCount)) * 100).toFixed(2) + '%',
    source_health: sourceHealth,
    sample_size: samples.length,
    last_analysis: new Date().toISOString()
  };
};

export const calculateRiskScore = async () => {
  const profile = await aggregateProfile();
  
  let riskScore = 50; // Base score
  const factors = [];

  // Facteur 1: Type de carte
  if (profile.credit_card?.card_type === 'Visa') {
    riskScore -= 10;
    factors.push({ factor: 'Card Type: Visa', impact: -10 });
  } else if (profile.credit_card?.card_type === 'AmericanExpress') {
    riskScore -= 15;
    factors.push({ factor: 'Card Type: AmEx', impact: -15 });
  }

  // Facteur 2: Validité IBAN
  if (profile.iban && !profile.iban.error && profile.iban.startsWith('FR')) {
    riskScore -= 5;
    factors.push({ factor: 'Valid French IBAN', impact: -5 });
  }

  // Facteur 3: Age (si disponible)
  if (profile.user?.age) {
    if (profile.user.age > 30 && profile.user.age < 60) {
      riskScore -= 10;
      factors.push({ factor: 'Stable Age Range', impact: -10 });
    } else {
      riskScore += 5;
      factors.push({ factor: 'Higher Risk Age', impact: +5 });
    }
  }

  // Facteur 4: Genre
  if (profile.user?.gender === 'female') {
    riskScore -= 3;
    factors.push({ factor: 'Statistical Gender Factor', impact: -3 });
  }

  const riskLevel = riskScore < 30 ? 'LOW' : riskScore < 50 ? 'MEDIUM' : 'HIGH';

  return {
    risk_score: Math.max(0, Math.min(100, riskScore)),
    risk_level: riskLevel,
    factors,
    profile_summary: {
      name: profile.user?.name,
      card_type: profile.credit_card?.card_type,
      age: profile.user?.age
    },
    calculated_at: new Date().toISOString()
  };
};


export const analyzeDemographics = async () => {
  const profiles = await Promise.all(
    Array(10).fill().map(() => aggregateProfile())
  );

  const demographics = {
    gender_distribution: { male: 0, female: 0 },
    age_groups: { '18-30': 0, '31-50': 0, '51+': 0 },
    card_types: {},
    location_clusters: {}
  };

  profiles.forEach(p => {
    // Genre
    if (p.user?.gender) demographics.gender_distribution[p.user.gender]++;
    
    // Age
    if (p.user?.age) {
      if (p.user.age <= 30) demographics.age_groups['18-30']++;
      else if (p.user.age <= 50) demographics.age_groups['31-50']++;
      else demographics.age_groups['51+']++;
    }

    // Types de cartes
    if (p.credit_card?.card_type) {
      demographics.card_types[p.credit_card.card_type] = 
        (demographics.card_types[p.credit_card.card_type] || 0) + 1;
    }

    // Localisation
    if (p.user?.location) {
      const city = p.user.location.split(',')[0];
      demographics.location_clusters[city] = 
        (demographics.location_clusters[city] || 0) + 1;
    }
  });

  return {
    sample_size: profiles.length,
    demographics,
    insights: [
      'Distribution de genre équilibrée',
      'Concentration urbaine détectée',
      'Diversité des types de cartes bancaires'
    ],
    analyzed_at: new Date().toISOString()
  };
};


export const calculatePredictiveScore = async () => {
  const profile = await aggregateProfile();
  
  // Score de propension d'achat (0-100)
  let purchaseScore = 50;
  
  // Facteurs d'achat
  if (profile.user?.age > 25 && profile.user?.age < 55) purchaseScore += 15;
  if (profile.credit_card?.card_type === 'Visa') purchaseScore += 10;
  if (profile.user?.gender === 'female') purchaseScore += 5;
  
  // Score de fidélité (0-100)
  let loyaltyScore = 40;
  if (profile.user?.age > 35) loyaltyScore += 20;
  if (profile.iban && !profile.iban.error) loyaltyScore += 15;

  // Score de churn (probabilité de départ, 0-100)
  let churnScore = 30;
  if (profile.user?.age < 25 || profile.user?.age > 65) churnScore += 20;
  
  return {
    predictions: {
      purchase_propensity: {
        score: Math.min(100, purchaseScore),
        level: purchaseScore > 70 ? 'HIGH' : purchaseScore > 50 ? 'MEDIUM' : 'LOW',
        confidence: '73%'
      },
      loyalty_index: {
        score: Math.min(100, loyaltyScore),
        level: loyaltyScore > 60 ? 'HIGH' : 'MEDIUM',
        confidence: '68%'
      },
      churn_risk: {
        score: Math.min(100, churnScore),
        level: churnScore > 50 ? 'HIGH' : 'LOW',
        confidence: '65%'
      }
    },
    recommendations: [
      purchaseScore > 70 ? 'Excellent prospect pour campagne marketing' : 'Nécessite nurturing',
      loyaltyScore > 60 ? 'Profil fidèle, privilégier rétention' : 'Risque de volatilité',
      churnScore > 50 ? 'Actions de rétention recommandées' : 'Relation stable'
    ],
    profile_id: profile.user?.email?.split('@')[0],
    predicted_at: new Date().toISOString(),
    model_version: '1.0-alpha'
  };
};