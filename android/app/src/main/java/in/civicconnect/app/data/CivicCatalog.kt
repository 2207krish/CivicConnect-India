package `in`.civicconnect.app.data

private val municipalDepartments = listOf(
    "roads", "sanitation", "garbage", "drainage", "street_lights",
    "parks", "stray_animals", "public_property"
)

private fun b(
    id: String,
    name: String,
    shortName: String,
    type: String,
    departments: List<String>,
    address: String,
    city: String,
    state: String,
    pincode: String,
    prefixes: List<String>,
    email: String,
    phone: String,
    lat: Double,
    lng: Double
) = CivicBody(id, name, shortName, type, departments, address, city, state, pincode, prefixes, email, phone, lat, lng)

val civicBodies: List<CivicBody> = listOf(
    b("municipal-new-delhi", "Municipal Corporation of Delhi", "MCD", "municipal", municipalDepartments, "Civic Centre, Minto Road, New Delhi", "New Delhi", "Delhi", "110002", listOf("110"), "complaints.mcd@delhi.gov.in", "155303", 28.6139, 77.209),
    b("electricity-new-delhi", "BSES Rajdhani Power Limited", "BRPL", "electricity", listOf("electricity"), "BSES Bhawan, Nehru Place, New Delhi", "New Delhi", "Delhi", "110019", listOf("110"), "complaints.brpl@bsesdelhi.com", "19123", 28.6239, 77.219),
    b("water-new-delhi", "Delhi Jal Board", "DJB", "water", listOf("water", "drainage"), "Varunalaya, Jhandewalan, New Delhi", "New Delhi", "Delhi", "110055", listOf("110"), "complaints@djb.gov.in", "1916", 28.6039, 77.217),
    b("traffic-new-delhi", "Delhi Traffic Police", "DTP", "traffic", listOf("traffic"), "Traffic HQ, Dev Prakash Shastri Marg, New Delhi", "New Delhi", "Delhi", "110012", listOf("110"), "complaints.traffic@delhipolice.gov.in", "1095", 28.6219, 77.199),

    b("municipal-mumbai", "Brihanmumbai Municipal Corporation", "BMC", "municipal", municipalDepartments, "Mahapalika Marg, Fort, Mumbai", "Mumbai", "Maharashtra", "400001", listOf("400"), "complaints@mcgm.gov.in", "1916", 19.076, 72.8777),
    b("electricity-mumbai", "Adani Electricity Mumbai Limited", "AEML", "electricity", listOf("electricity"), "Devidas Lane, Borivali West, Mumbai", "Mumbai", "Maharashtra", "400103", listOf("400"), "customercare@adanielectricity.com", "19122", 19.086, 72.8877),
    b("water-mumbai", "BMC Hydraulic Engineer Department", "BMC Water", "water", listOf("water", "drainage"), "Municipal Head Office, Fort, Mumbai", "Mumbai", "Maharashtra", "400001", listOf("400"), "water.complaints@mcgm.gov.in", "1916", 19.066, 72.8857),
    b("traffic-mumbai", "Mumbai Traffic Police", "MTP", "traffic", listOf("traffic"), "Traffic HQ, Sir Pochkhanwala Road, Mumbai", "Mumbai", "Maharashtra", "400013", listOf("400"), "traffic.complaints@mumbaipolice.gov.in", "103", 19.084, 72.8677),

    b("municipal-pune", "Pune Municipal Corporation", "PMC", "municipal", municipalDepartments, "Shivajinagar, Pune", "Pune", "Maharashtra", "411005", listOf("411"), "complaints@punecorporation.org", "020-25501113", 18.5204, 73.8567),
    b("electricity-pune", "MSEDCL Pune", "MSEDCL Pune", "electricity", listOf("electricity"), "Rastapeth, Pune", "Pune", "Maharashtra", "411011", listOf("411"), "complaints.pune@mahadiscom.in", "19120", 18.5304, 73.8667),
    b("water-pune", "PMC Water Supply Department", "PMC Water", "water", listOf("water", "drainage"), "PMC Main Building, Shivajinagar, Pune", "Pune", "Maharashtra", "411005", listOf("411"), "water@punecorporation.org", "020-25501100", 18.5104, 73.8647),

    b("municipal-nagpur", "Nagpur Municipal Corporation", "NMC", "municipal", municipalDepartments, "Civil Lines, Nagpur", "Nagpur", "Maharashtra", "440001", listOf("440"), "complaints@nmcnagpur.gov.in", "0712-2567025", 21.1458, 79.0882),
    b("electricity-nagpur", "MSEDCL Nagpur Urban", "MSEDCL Nagpur", "electricity", listOf("electricity"), "Prakash Bhavan, Nagpur", "Nagpur", "Maharashtra", "440001", listOf("440"), "complaints.nagpur@mahadiscom.in", "19120", 21.1558, 79.0982),
    b("water-nagpur", "Nagpur Environmental Services Ltd.", "NESL", "water", listOf("water", "drainage"), "Civil Lines, Nagpur", "Nagpur", "Maharashtra", "440001", listOf("440"), "water@nmcnagpur.gov.in", "0712-2567001", 21.1358, 79.0962),

    b("municipal-bengaluru", "Bruhat Bengaluru Mahanagara Palike", "BBMP", "municipal", municipalDepartments, "N.R. Square, Bengaluru", "Bengaluru", "Karnataka", "560002", listOf("560"), "complaints@bbmp.gov.in", "1533", 12.9716, 77.5946),
    b("electricity-bengaluru", "Bangalore Electricity Supply Company Limited", "BESCOM", "electricity", listOf("electricity"), "K.R. Circle, Bengaluru", "Bengaluru", "Karnataka", "560001", listOf("560"), "helpdesk@bescom.co.in", "1912", 12.9816, 77.6046),
    b("water-bengaluru", "Bangalore Water Supply and Sewerage Board", "BWSSB", "water", listOf("water", "drainage"), "Cauvery Bhavan, K.G. Road, Bengaluru", "Bengaluru", "Karnataka", "560009", listOf("560"), "complaints@bwssb.gov.in", "1916", 12.9616, 77.6026),
    b("traffic-bengaluru", "Bengaluru Traffic Police", "BTP", "traffic", listOf("traffic"), "Infantry Road, Bengaluru", "Bengaluru", "Karnataka", "560001", listOf("560"), "traffic@bengalurupolice.gov.in", "080-22942424", 12.9796, 77.5846),

    b("municipal-chennai", "Greater Chennai Corporation", "GCC", "municipal", municipalDepartments, "Ripon Building, Chennai", "Chennai", "Tamil Nadu", "600003", listOf("600"), "complaints@chennaicorporation.gov.in", "1913", 13.0827, 80.2707),
    b("electricity-chennai", "TANGEDCO Chennai", "TANGEDCO", "electricity", listOf("electricity"), "144, Anna Salai, Chennai", "Chennai", "Tamil Nadu", "600002", listOf("600"), "complaints.chennai@tangedco.gov.in", "94987 94987", 13.0927, 80.2807),
    b("water-chennai", "Chennai Metropolitan Water Supply and Sewerage Board", "CMWSSB", "water", listOf("water", "drainage"), "Pumping Station Road, Chintadripet, Chennai", "Chennai", "Tamil Nadu", "600002", listOf("600"), "complaints@chennaimetrowater.gov.in", "044-28451300", 13.0727, 80.2787),

    b("municipal-kolkata", "Kolkata Municipal Corporation", "KMC", "municipal", municipalDepartments, "5, S.N. Banerjee Road, Kolkata", "Kolkata", "West Bengal", "700013", listOf("700"), "complaints@kmcgov.in", "033-22861234", 22.5726, 88.3639),
    b("electricity-kolkata", "Calcutta Electric Supply Corporation", "CESC", "electricity", listOf("electricity"), "CESC House, Chowringhee Square, Kolkata", "Kolkata", "West Bengal", "700001", listOf("700"), "complaint@cesc.co.in", "1912", 22.5826, 88.3739),
    b("water-kolkata", "KMC Water Supply Department", "KMC Water", "water", listOf("water", "drainage"), "KMC Headquarters, Kolkata", "Kolkata", "West Bengal", "700013", listOf("700"), "water@kmcgov.in", "033-22861000", 22.5626, 88.3719),

    b("municipal-hyderabad", "Greater Hyderabad Municipal Corporation", "GHMC", "municipal", municipalDepartments, "CC Complex, Tank Bund Road, Hyderabad", "Hyderabad", "Telangana", "500063", listOf("500"), "complaints@ghmc.gov.in", "040-21111111", 17.385, 78.4867),
    b("electricity-hyderabad", "TSSPDCL", "TSSPDCL", "electricity", listOf("electricity"), "Mint Compound, Hyderabad", "Hyderabad", "Telangana", "500063", listOf("500"), "customercare@tssouthernpower.com", "1912", 17.395, 78.4967),
    b("water-hyderabad", "Hyderabad Metropolitan Water Supply and Sewerage Board", "HMWSSB", "water", listOf("water", "drainage"), "Khairatabad, Hyderabad", "Hyderabad", "Telangana", "500004", listOf("500"), "complaints@hyderabadwater.gov.in", "155313", 17.375, 78.4947),

    b("municipal-ahmedabad", "Ahmedabad Municipal Corporation", "AMC", "municipal", municipalDepartments, "Sardar Patel Bhavan, Danapith, Ahmedabad", "Ahmedabad", "Gujarat", "380001", listOf("380"), "complaints@ahmedabadcity.gov.in", "079-25391811", 23.0225, 72.5714),
    b("electricity-ahmedabad", "Torrent Power Ahmedabad", "Torrent", "electricity", listOf("electricity"), "Sola Road, Naranpura, Ahmedabad", "Ahmedabad", "Gujarat", "380013", listOf("380"), "customercare.ahd@torrentpower.com", "1800 233 4444", 23.0325, 72.5814),
    b("water-ahmedabad", "AMC Water Project Department", "AMC Water", "water", listOf("water", "drainage"), "Danapith, Ahmedabad", "Ahmedabad", "Gujarat", "380001", listOf("380"), "water@ahmedabadcity.gov.in", "079-25391800", 23.0125, 72.5794),

    b("municipal-surat", "Surat Municipal Corporation", "SMC", "municipal", municipalDepartments, "Muglisara, Surat", "Surat", "Gujarat", "395003", listOf("394", "395"), "complaints@suratmunicipal.org", "1800 246 5000", 21.1702, 72.8311),
    b("electricity-surat", "Dakshin Gujarat Vij Company Ltd.", "DGVCL", "electricity", listOf("electricity"), "Nana Varachha, Surat", "Surat", "Gujarat", "395006", listOf("394", "395"), "complaints@dgvcl.com", "19122", 21.1802, 72.8411),
    b("water-surat", "SMC Hydraulic Department", "SMC Water", "water", listOf("water", "drainage"), "Muglisara, Surat", "Surat", "Gujarat", "395003", listOf("394", "395"), "water@suratmunicipal.org", "0261-2423750", 21.1602, 72.8391),

    b("municipal-jaipur", "Jaipur Municipal Corporation", "JMC", "municipal", municipalDepartments, "JMC Building, JLN Marg, Jaipur", "Jaipur", "Rajasthan", "302017", listOf("302"), "complaints@jaipurmc.org", "0141-2742246", 26.9124, 75.7873),
    b("electricity-jaipur", "Jaipur Vidyut Vitran Nigam Limited", "JVVNL", "electricity", listOf("electricity"), "Vidyut Bhawan, Janpath, Jaipur", "Jaipur", "Rajasthan", "302005", listOf("302"), "complaints@jvvnl.org", "1912", 26.9224, 75.7973),
    b("water-jaipur", "PHED Jaipur", "PHED Jaipur", "water", listOf("water", "drainage"), "Jal Bhawan, Civil Lines, Jaipur", "Jaipur", "Rajasthan", "302006", listOf("302"), "complaints.jaipur@phed.rajasthan.gov.in", "0141-2222481", 26.9024, 75.7953),

    b("municipal-lucknow", "Lucknow Municipal Corporation", "LMC", "municipal", municipalDepartments, "Lalbagh, Lucknow", "Lucknow", "Uttar Pradesh", "226001", listOf("226"), "complaints@lmc.up.gov.in", "0522-2622662", 26.8467, 80.9462),
    b("electricity-lucknow", "Madhyanchal Vidyut Vitran Nigam Ltd.", "MVVNL", "electricity", listOf("electricity"), "4-A, Gokhale Marg, Lucknow", "Lucknow", "Uttar Pradesh", "226001", listOf("226"), "complaints@mvvnl.in", "1912", 26.8567, 80.9562),
    b("water-lucknow", "Lucknow Jal Sansthan", "LJS", "water", listOf("water", "drainage"), "Kaiserbagh, Lucknow", "Lucknow", "Uttar Pradesh", "226001", listOf("226"), "complaints@ljs.up.gov.in", "0522-2622402", 26.8367, 80.9542),

    b("municipal-bhopal", "Bhopal Municipal Corporation", "BMC Bhopal", "municipal", municipalDepartments, "Sadar Manzil, Bhopal", "Bhopal", "Madhya Pradesh", "462001", listOf("462"), "complaints@bhopalmunicipal.com", "0755-2540045", 23.2599, 77.4126),
    b("electricity-bhopal", "MPMKVVCL", "MPMKVVCL", "electricity", listOf("electricity"), "Nishtha Parisar, Govindpura, Bhopal", "Bhopal", "Madhya Pradesh", "462023", listOf("462"), "complaints@mpcz.co.in", "1912", 23.2699, 77.4226),
    b("water-bhopal", "Bhopal Municipal Water Works", "BMC Water", "water", listOf("water", "drainage"), "Sadar Manzil, Bhopal", "Bhopal", "Madhya Pradesh", "462001", listOf("462"), "water@bhopalmunicipal.com", "0755-2540001", 23.2499, 77.4206),

    b("municipal-indore", "Indore Municipal Corporation", "IMC", "municipal", municipalDepartments, "MG Road, Indore", "Indore", "Madhya Pradesh", "452007", listOf("452"), "complaints@imcindore.org", "0731-2535555", 22.7196, 75.8577),
    b("electricity-indore", "MPPKVVCL", "MPPKVVCL", "electricity", listOf("electricity"), "Polo Ground, Indore", "Indore", "Madhya Pradesh", "452003", listOf("452"), "complaints@mpwz.co.in", "1912", 22.7296, 75.8677),
    b("water-indore", "IMC Water Supply Department", "IMC Water", "water", listOf("water", "drainage"), "MG Road, Indore", "Indore", "Madhya Pradesh", "452007", listOf("452"), "water@imcindore.org", "0731-2535500", 22.7096, 75.8657),

    b("municipal-chandigarh", "Municipal Corporation Chandigarh", "MCC", "municipal", municipalDepartments, "New Deluxe Building, Sector 17, Chandigarh", "Chandigarh", "Chandigarh", "160017", listOf("160"), "complaints@mcchandigarh.gov.in", "0172-5021501", 30.7333, 76.7794),
    b("electricity-chandigarh", "Electricity Wing, Chandigarh", "CHD Electricity", "electricity", listOf("electricity"), "Sector 9, Chandigarh", "Chandigarh", "Chandigarh", "160009", listOf("160"), "complaints.electricity@chd.nic.in", "0172-2740192", 30.7433, 76.7894),
    b("water-chandigarh", "Municipal Corporation Water Supply, Chandigarh", "MCC Water", "water", listOf("water", "drainage"), "Sector 17, Chandigarh", "Chandigarh", "Chandigarh", "160017", listOf("160"), "water@mcchandigarh.gov.in", "0172-5021500", 30.7233, 76.7874),

    b("municipal-kochi", "Kochi Municipal Corporation", "KMC Kochi", "municipal", municipalDepartments, "Park Avenue, Ernakulam, Kochi", "Kochi", "Kerala", "682011", listOf("682"), "complaints@cochinmunicipal.org", "0484-2369007", 9.9312, 76.2673),
    b("electricity-kochi", "Kerala State Electricity Board (Ernakulam)", "KSEB", "electricity", listOf("electricity"), "Power House Road, Ernakulam", "Kochi", "Kerala", "682018", listOf("682"), "complaints.ekm@kseb.in", "1912", 9.9412, 76.2773),
    b("water-kochi", "Kerala Water Authority, Kochi", "KWA Kochi", "water", listOf("water", "drainage"), "Palarivattom, Kochi", "Kochi", "Kerala", "682025", listOf("682"), "complaints.kochi@kwa.kerala.gov.in", "0484-2345800", 9.9212, 76.2753),

    b("municipal-patna", "Patna Municipal Corporation", "PMC Patna", "municipal", municipalDepartments, "Gandhi Maidan, Patna", "Patna", "Bihar", "800001", listOf("800"), "complaints@pmc.bihar.gov.in", "0612-2219176", 25.5941, 85.1376),
    b("electricity-patna", "South Bihar Power Distribution Company Ltd.", "SBPDCL", "electricity", listOf("electricity"), "Vidyut Bhawan, Bailey Road, Patna", "Patna", "Bihar", "800001", listOf("800"), "complaints@sbpdcl.co.in", "1912", 25.6041, 85.1476),
    b("water-patna", "Patna Jal Parishad", "PJP", "water", listOf("water", "drainage"), "Buddha Marg, Patna", "Patna", "Bihar", "800001", listOf("800"), "water@pmc.bihar.gov.in", "0612-2219100", 25.5841, 85.1456),

    b("municipal-bhubaneswar", "Bhubaneswar Municipal Corporation", "BMC Odisha", "municipal", municipalDepartments, "Vivekananda Marg, Bhubaneswar", "Bhubaneswar", "Odisha", "751014", listOf("751"), "complaints@bmc.gov.in", "0674-2431253", 20.2961, 85.8245),
    b("electricity-bhubaneswar", "TP Central Odisha Distribution Ltd.", "TPCODL", "electricity", listOf("electricity"), "IDCO Towers, Janpath, Bhubaneswar", "Bhubaneswar", "Odisha", "751022", listOf("751"), "customercare@tpcentralodisha.com", "1912", 20.3061, 85.8345),
    b("water-bhubaneswar", "WATCO Bhubaneswar", "WATCO", "water", listOf("water", "drainage"), "Satya Nagar, Bhubaneswar", "Bhubaneswar", "Odisha", "751007", listOf("751"), "complaints@watcoodisha.in", "0674-2391430", 20.2861, 85.8325),

    b("municipal-guwahati", "Guwahati Municipal Corporation", "GMC", "municipal", municipalDepartments, "Panbazar, Guwahati", "Guwahati", "Assam", "781001", listOf("781"), "complaints@gmc.assam.gov.in", "0361-2540525", 26.1445, 91.7362),
    b("electricity-guwahati", "Assam Power Distribution Company Ltd.", "APDCL", "electricity", listOf("electricity"), "Bijulee Bhawan, Paltan Bazar, Guwahati", "Guwahati", "Assam", "781001", listOf("781"), "complaints@apdcl.org", "1912", 26.1545, 91.7462),
    b("water-guwahati", "Guwahati Jal Board", "GJB", "water", listOf("water", "drainage"), "Fancy Bazar, Guwahati", "Guwahati", "Assam", "781001", listOf("781"), "water@gmc.assam.gov.in", "0361-2540500", 26.1345, 91.7442),

    b("municipal-visakhapatnam", "Greater Visakhapatnam Municipal Corporation", "GVMC", "municipal", municipalDepartments, "Tenneti Bhavan, Asilmetta, Visakhapatnam", "Visakhapatnam", "Andhra Pradesh", "530003", listOf("530"), "complaints@gvmc.gov.in", "0891-2746301", 17.6868, 83.2185),
    b("electricity-visakhapatnam", "APEPDCL", "APEPDCL", "electricity", listOf("electricity"), "P&T Colony, Seethammadhara, Visakhapatnam", "Visakhapatnam", "Andhra Pradesh", "530013", listOf("530"), "complaints@apeasternpower.com", "1912", 17.6968, 83.2285),
    b("water-visakhapatnam", "GVMC Water Supply Wing", "GVMC Water", "water", listOf("water", "drainage"), "Asilmetta, Visakhapatnam", "Visakhapatnam", "Andhra Pradesh", "530003", listOf("530"), "water@gvmc.gov.in", "0891-2746300", 17.6768, 83.2265)
)

fun civicBodyById(id: String) = civicBodies.find { it.id == id }
