export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const CITIES_BY_STATE: Record<string, string[]> = {
  Delhi: ["New Delhi", "Delhi", "Dwarka", "Rohini", "Saket"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur"],
  Telangana: ["Hyderabad", "Warangal", "Secunderabad"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Noida", "Ghaziabad"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  Chandigarh: ["Chandigarh"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Puri"],
  Assam: ["Guwahati"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
};

export interface CityMeta {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const CITY_COORDS: CityMeta[] = [
  { city: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
  { city: "Delhi", state: "Delhi", lat: 28.7041, lng: 77.1025 },
  { city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { city: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { city: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { city: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  { city: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
];

export const PINCODE_DIRECTORY: Record<
  string,
  { area: string; city: string; state: string }
> = {
  "110001": { area: "Connaught Place", city: "New Delhi", state: "Delhi" },
  "110002": { area: "Darya Ganj", city: "New Delhi", state: "Delhi" },
  "110017": { area: "Malviya Nagar", city: "New Delhi", state: "Delhi" },
  "110019": { area: "Kalkaji", city: "New Delhi", state: "Delhi" },
  "110085": { area: "Rohini", city: "Delhi", state: "Delhi" },
  "400001": { area: "Fort", city: "Mumbai", state: "Maharashtra" },
  "400053": { area: "Andheri", city: "Mumbai", state: "Maharashtra" },
  "400050": { area: "Bandra", city: "Mumbai", state: "Maharashtra" },
  "411001": { area: "Pune Camp", city: "Pune", state: "Maharashtra" },
  "411004": { area: "Deccan", city: "Pune", state: "Maharashtra" },
  "440001": { area: "Sitabuldi", city: "Nagpur", state: "Maharashtra" },
  "560001": { area: "MG Road", city: "Bengaluru", state: "Karnataka" },
  "560038": { area: "Indiranagar", city: "Bengaluru", state: "Karnataka" },
  "560078": { area: "JP Nagar", city: "Bengaluru", state: "Karnataka" },
  "600001": { area: "Parrys Corner", city: "Chennai", state: "Tamil Nadu" },
  "600017": { area: "T. Nagar", city: "Chennai", state: "Tamil Nadu" },
  "600040": { area: "Anna Nagar", city: "Chennai", state: "Tamil Nadu" },
  "700001": { area: "BBD Bagh", city: "Kolkata", state: "West Bengal" },
  "700019": { area: "Ballygunge", city: "Kolkata", state: "West Bengal" },
  "500001": { area: "Abids", city: "Hyderabad", state: "Telangana" },
  "500081": { area: "HITEC City", city: "Hyderabad", state: "Telangana" },
  "380001": { area: "Lal Darwaza", city: "Ahmedabad", state: "Gujarat" },
  "380015": { area: "Navrangpura", city: "Ahmedabad", state: "Gujarat" },
  "395001": { area: "Chowk Bazar", city: "Surat", state: "Gujarat" },
  "302001": { area: "Johari Bazaar", city: "Jaipur", state: "Rajasthan" },
  "302017": { area: "Malviya Nagar", city: "Jaipur", state: "Rajasthan" },
  "226001": { area: "Hazratganj", city: "Lucknow", state: "Uttar Pradesh" },
  "226010": { area: "Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh" },
  "462001": { area: "TT Nagar", city: "Bhopal", state: "Madhya Pradesh" },
  "452001": { area: "Rajwada", city: "Indore", state: "Madhya Pradesh" },
  "160017": { area: "Sector 17", city: "Chandigarh", state: "Chandigarh" },
  "160036": { area: "Sector 36", city: "Chandigarh", state: "Chandigarh" },
  "682001": { area: "Fort Kochi", city: "Kochi", state: "Kerala" },
  "682016": { area: "Ernakulam", city: "Kochi", state: "Kerala" },
  "800001": { area: "Gandhi Maidan", city: "Patna", state: "Bihar" },
  "751001": { area: "Unit 1", city: "Bhubaneswar", state: "Odisha" },
  "781001": { area: "Pan Bazaar", city: "Guwahati", state: "Assam" },
  "530001": { area: "Old Town", city: "Visakhapatnam", state: "Andhra Pradesh" },
};

export function lookupPincode(pincode: string) {
  return PINCODE_DIRECTORY[pincode];
}

export function getCityMeta(city: string, state: string) {
  const normalizedCity = city.trim().toLowerCase();
  const normalizedState = state.trim().toLowerCase();

  return (
    CITY_COORDS.find(
      (item) =>
        item.city.toLowerCase() === normalizedCity &&
        item.state.toLowerCase() === normalizedState
    ) ??
    CITY_COORDS.find((item) => item.city.toLowerCase() === normalizedCity) ??
    CITY_COORDS.find((item) => item.state.toLowerCase() === normalizedState)
  );
}
