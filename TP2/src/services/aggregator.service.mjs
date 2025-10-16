import fetch from 'node-fetch';

const API_KEY = 'b4a95ecc867f4c6496b36e35bb43e654';
const TIMEOUT = 5000;

const safeFetch = async (url, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchRandomUser = async () => {
  const data = await safeFetch('https://randomuser.me/api/?nat=fr');
  if (data.error) return data;
  
  const user = data.results[0];
  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    gender: user.gender,
    location: `${user.location.city}, ${user.location.country}`,
    picture: user.picture.large,
    age: user.dob.age,
    nationality: user.nat
  };
};

const fetchPhone = async () => {
  const data = await safeFetch(
    'https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1',
    { headers: { 'X-Api-Key': API_KEY } }
  );
  return data.error ? data : data[0];
};

const fetchIban = async () => {
  return await safeFetch(
    'https://randommer.io/api/Finance/Iban/FR',
    { headers: { 'X-Api-Key': API_KEY } }
  );
};

const fetchCard = async () => {
  const data = await safeFetch(
    'https://randommer.io/api/Card',
    { headers: { 'X-Api-Key': API_KEY } }
  );
  
  if (data.error) return data;
  
  return {
    card_number: data.cardNumber,
    card_type: data.type,
    expiration_date: data.date,
    cvv: data.cvv
  };
};

const fetchJoke = async () => {
  const data = await safeFetch(
    'https://v2.jokeapi.dev/joke/Programming?type=single'
  );
  
  if (data.error) return data;
  
  return {
    type: data.category,
    content: data.joke
  };
};

export const aggregateProfile = async () => {
  const [user, phone, iban, card, joke] = await Promise.all([
    fetchRandomUser(),
    fetchPhone(),
    fetchIban(),
    fetchCard(),
    fetchJoke()
  ]);

  return {
    user,
    phone_number: phone,
    iban,
    credit_card: card,
    joke,
    aggregated_at: new Date().toISOString(),
    sources_count: 5
  };
};