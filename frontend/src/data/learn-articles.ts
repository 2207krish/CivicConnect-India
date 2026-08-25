import { civicImages } from "@/config/media";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  image: string;
  imageAlt: string;
  sections: ArticleSection[];
}

export const learnArticles: Article[] = [
  {
    slug: "how-municipal-budgets-work-in-india",
    title: "How municipal budgets work in India, and where your taxes actually go",
    excerpt:
      "A plain-language walk through property tax, state grants, capital works and why a pothole can sit unfilled even when a city looks well funded on paper.",
    category: "Municipal finance",
    publishedAt: "2026-07-08",
    readingMinutes: 8,
    image: civicImages.city,
    imageAlt: "Indian city skyline and civic infrastructure",
    sections: [
      {
        heading: "A city budget is not a shopping list",
        paragraphs: [
          "When people hear that a municipal corporation has a budget of several thousand crore rupees, they often assume there is a ready pile of cash for every broken road. That is not how urban local bodies work. A municipal budget is a legal plan for the coming financial year. It estimates what the city expects to collect, what it is already committed to spend, and what new works it hopes to start. A large share is already spoken for before a single new pothole is discussed.",
          "Indian cities typically present two broad pictures. The revenue budget covers day-to-day running: salaries, electricity for street lights, water treatment chemicals, conservancy contracts, and office costs. The capital budget covers assets that last many years: roads, drains, water pipelines, parks, and buildings. If most of the money is locked into salaries and existing contracts, very little remains for new capital work even if the headline number looks large.",
        ],
      },
      {
        heading: "Where the money comes from",
        paragraphs: [
          "Urban local bodies raise money from their own sources and from transfers. Own sources include property tax, water and sewerage charges, trade licences, building permission fees, advertisement tax, and in some cities a share of goods and services related local levies. Transfers include grants from the State Government, Finance Commission awards, and Centrally sponsored schemes for missions such as housing, water or urban rejuvenation.",
          "Property tax is the backbone of municipal self-reliance, yet collection is often weak. Assessments may be outdated, vacant properties may be under-billed, and recovery of arrears can be slow. That is why two neighbouring wards can look very different. One ward may have a dense, fully assessed commercial street. Another may have unauthorised layouts that are hard to tax. The corporation’s overall budget does not automatically mean your street has a fair share sitting in a drawer.",
          "State grants and scheme funds usually come with conditions. Money tagged for a water project cannot legally be diverted to fill potholes. Money for a named flyover cannot be used for lane marking. Citizens who ask “why is there no money for our drain?” are often looking at the wrong envelope. The right question is which budget head, scheme or ward allocation covers that drain.",
        ],
      },
      {
        heading: "How the budget is made",
        paragraphs: [
          "The process usually begins months before 1 April. Departments send estimates. The accounts or finance wing consolidates them. The standing committee or equivalent body debates priorities. The council or corporation house votes. In many states, the State Government or a municipal directorate also has a say if the city wants to borrow or if the budget is in deficit.",
          "Public participation is uneven. Some cities publish a draft budget, hold consultations, or run a participatory budgeting experiment in selected wards. Many still treat the budget as an internal document until it is passed. Citizens can still use the Right to Information Act to obtain the budget book, ward-wise works lists, and utilisation certificates. Those papers show whether last year’s “road restoration” money was actually spent, and on which stretches.",
        ],
      },
      {
        heading: "How to read it as a resident",
        paragraphs: [
          "Start with three pages, not the whole volume. First, the abstract of receipts and payments: is the city living on its own taxes or on grants? Second, the capital works annexure: are there named roads, drains or parks in your ward? Third, the outstanding liabilities: loans, unpaid contractor bills, and court decrees. A city that is paying old bills will have less room for new work.",
          "Then compare last year’s budget with last year’s actuals. A budget that keeps promising the same drain every year, while actuals show little expenditure, is a signal. It may mean tender delays, land disputes, or simply that the item is a placeholder. That is useful evidence when you escalate a civic complaint. You are no longer only saying “the road is bad.” You can say “the corporation listed this stretch and did not spend.”",
          "CivicConnect India cannot pass a budget, but it can help you put a dated, tracked complaint on the correct municipal or utility desk. Pair that complaint with a budget extract obtained through RTI, and the file becomes harder to ignore. The budget is a public document. Learning to read it is one of the most practical civic skills a resident can pick up.",
        ],
      },
    ],
  },
  {
    slug: "how-to-escalate-a-stalled-civic-complaint",
    title: "How to escalate a stalled civic complaint without starting from zero",
    excerpt:
      "A step-by-step path from the local complaint desk to the ward councillor, standing committee, state urban department and, where needed, statutory forums.",
    category: "Citizen action",
    publishedAt: "2026-07-12",
    readingMinutes: 7,
    image: civicImages.road,
    imageAlt: "Urban road in need of civic repair",
    sections: [
      {
        heading: "First, prove the complaint exists",
        paragraphs: [
          "Escalation fails when the higher office cannot find the original case. Before you go to a councillor or a state portal, collect a packet: the tracking ID, the date and time of filing, the email or SMS acknowledgement, photographs with a visible landmark, and a short timeline of what happened after you reported the issue. If the first desk never issued a number, ask for one in writing. A case without a number is easy to deny.",
          "On CivicConnect India, the tracking ID is designed for this moment. Anyone with the ID can see the public status. When you write to the next level, quote that ID in the subject line. Officials search by number, not by the story of the pothole near the bakery.",
        ],
      },
      {
        heading: "The local ladder",
        paragraphs: [
          "Most Indian cities have a similar ladder even if the titles differ. The junior engineer or sectional officer is the first field officer. Above that sits an assistant or executive engineer for the ward or zone. Parallel to the engineers is the elected side: the ward councillor or corporator. Many problems move only when the elected representative asks the engineer for a status note.",
          "If the ward office is silent for a reasonable period — two to three weeks for a non-emergency road or light, less for a sewage overflow — write to the zonal or deputy commissioner with the same packet. Keep the letter short. State the location with PIN code, the original complaint number, the date, what was promised, and what is still broken. Attach two photographs, not twenty. Ask for a written inspection date.",
          "The standing committee, works committee or equivalent is the next political filter. Councillors raise unfinished works there. You do not always get a personal hearing, but a councillor who has your tracking ID and photographs can table the item. Minutes of those meetings are often public. If your work is listed and then dropped, that too is a fact you can quote later.",
        ],
      },
      {
        heading: "State and statutory routes",
        paragraphs: [
          "When the city itself is stuck, use the State urban development or municipal administration department’s grievance channel. Several states also run a chief minister’s helpline. These desks do not repair the road. They ask the corporation for an explanation. That query from above is often what unblocks a file.",
          "For electricity, the path is different. After the DISCOM complaint centre, consumers can approach the Consumer Grievance Redressal Forum and then the Electricity Ombudsman under the Electricity Act. For water, some states have a water regulatory commission or a designated appellate authority. Mixing these paths — writing to the municipal commissioner about a DISCOM transformer — wastes weeks.",
          "Do not threaten or copy the world on the first reminder. A clean, numbered escalation file is more effective than a viral post that never reaches the officer who holds the estimate. If you use social media, still keep the official trail. Courts and information commissions look at records, not at screenshots of comments.",
        ],
      },
    ],
  },
  {
    slug: "using-rti-for-civic-works",
    title: "Using the Right to Information Act to follow a road, drain or park work",
    excerpt:
      "How to ask for estimates, tenders, work orders and utilisation certificates so a civic complaint is backed by the city’s own papers.",
    category: "Transparency",
    publishedAt: "2026-07-16",
    readingMinutes: 8,
    image: civicImages.hero,
    imageAlt: "Public buildings and civic institutions in India",
    sections: [
      {
        heading: "RTI is a follow-up tool, not a first complaint",
        paragraphs: [
          "The Right to Information Act, 2005, gives citizens a way to inspect the papers behind a civic work. It is not a substitute for reporting a pothole. First file the complaint with the department that must act. Then use RTI if the work is delayed, repeated every monsoon, or listed in a budget but invisible on the ground.",
          "Public authorities include municipal corporations, municipalities, development authorities, water boards and, in most cases, electricity distribution companies that are public utilities. Each has a Public Information Officer. Many publish the PIO’s name and email on their website. If they do not, the State Information Commission site usually lists them.",
        ],
      },
      {
        heading: "Ask for records, not opinions",
        paragraphs: [
          "A good RTI application asks for copies of existing records. Poor applications ask “why has the corporation failed the people of Ward 14?” That invites a vague reply. Better questions are specific: the sanctioned estimate for restoration of X road between two landmarks; the tender notice and work order number; the name of the contractor; the date of commencement and stipulated date of completion; running account bills paid so far; and any extension of time granted.",
          "You may also ask for the ward-wise list of works sanctioned in the current year and last year, and for utilisation certificates submitted to the State Government for a named scheme. If the city claims a drain was desilted last month, ask for the measurement book extract or the contractor’s bill for that beat. Either the papers exist, or the claim is weak.",
          "Keep the request to a few items. Ten precise points are better than forty. Pay the prescribed fee. File online where the state has a portal, or by speed post with an acknowledgement. Note the date. The Act generally requires a response in thirty days, with a slightly longer period if another office must be consulted.",
        ],
      },
      {
        heading: "What to do with the reply",
        paragraphs: [
          "If you receive estimates and a work order, compare them with the street. A work order for 200 metres of resurfacing should leave a visible stretch. If you receive a reply that the information is not available, that is itself useful. First appeals go to the First Appellate Authority in the same body. Second appeals go to the State Information Commission.",
          "Do not publish contractors’ personal mobile numbers or employees’ home addresses if they appear in the file. Stick to the work. Attach the RTI reply, minus personal data, when you escalate the original civic complaint. The combination of a tracking ID, photographs, and the city’s own estimate is a strong public file.",
          "RTI is not a weapon for harassment. Frivolous bulk applications slow down genuine ones. Use it when a named civic work affects safety, flooding, or repeated waste of public money. CivicConnect can carry the first complaint to the desk. RTI tells you whether that desk ever opened a work file.",
        ],
      },
    ],
  },
  {
    slug: "74th-amendment-and-your-city-government",
    title: "The 74th Constitutional Amendment and what it means for your city government",
    excerpt:
      "Why India created urban local bodies as a third tier of government, and how that design affects who you should call about a civic fault.",
    category: "Civic rights",
    publishedAt: "2026-07-20",
    readingMinutes: 7,
    image: civicImages.gateway,
    imageAlt: "Historic civic architecture in an Indian city",
    sections: [
      {
        heading: "Cities were meant to govern themselves",
        paragraphs: [
          "The Constitution (Seventy-fourth Amendment) Act, 1992, inserted Part IXA into the Constitution. It required States to constitute municipalities and to endow them with powers and responsibilities. The idea was simple: local problems should have local governments, not only distant secretariats. Municipal corporations, municipal councils and nagar panchayats became a recognised third tier.",
          "The Twelfth Schedule lists functions that States may devolve: urban planning, water supply, public health, solid waste, roads and bridges, fire services, slum improvement, and more. Devolution is not automatic. Each State passes its own municipal law and decides how much of that list actually sits with the city. That is why a drain in one State is a municipal job and in another is still a parastatal or Public Works subject.",
        ],
      },
      {
        heading: "The elected house and the commissioner",
        paragraphs: [
          "Most large Indian cities have an elected council and an appointed commissioner or municipal commissioner. The council sets policy and passes the budget. The commissioner runs the administration. Tension between the two is common. Citizens feel it when a councillor promises a work and the engineering department says there is no estimate. Both may be telling a partial truth.",
          "Wards are the basic electoral units. Your councillor is the political face of the ward. Engineers are organised by ward, zone or circle. Matching your complaint to the right ward office is more important than writing to the headquarters. Headquarters will often mark the letter back to the zone anyway, losing a week.",
        ],
      },
      {
        heading: "Why this matters when you complain",
        paragraphs: [
          "If a function is still with a State department or a board, writing only to the municipal corporation will fail. Water in several metros is run by a jal board. Electricity is almost always a DISCOM. Urban roads may be split among the corporation, a development authority, and the Public Works Department depending on the width of the road or whether it is a State highway through the city.",
          "The Amendment also envisaged ward committees in larger cities so that people closer to the street could be heard. Implementation is patchy. Where ward committees meet, residents’ associations can place items on the agenda. Where they do not, the councillor’s weekly meeting or the zonal grievance day is the practical substitute.",
          "CivicConnect India is built around this split of desks. It tries to route a roads complaint to the municipal email, a power cut to the electricity utility, and a water leak to the water board when those offices are mapped. Understanding the 74th Amendment will not fill a pothole overnight. It will stop you from standing in the wrong queue.",
        ],
      },
    ],
  },
  {
    slug: "who-repairs-your-street-municipal-pwd-or-nhai",
    title: "Who is supposed to repair your street: municipality, PWD, or the highway authority?",
    excerpt:
      "Road ownership in Indian cities is split by width, history and notification. Knowing the owner is half of a successful complaint.",
    category: "Roads",
    publishedAt: "2026-07-24",
    readingMinutes: 7,
    image: civicImages.road,
    imageAlt: "City street and traffic in India",
    sections: [
      {
        heading: "One pothole, three possible owners",
        paragraphs: [
          "A crater on a city street is not always the municipal corporation’s job. Urban road networks are layered. Internal colony roads and most ward streets usually belong to the municipality. Wider arterial roads may be with the Public Works Department or an urban development authority. National highways and some expressways that pass through the city belong to the National Highways Authority of India or a State highway wing.",
          "Utility cuts make this worse. A water board or a telecom licensee may open the carriageway, restore it poorly, and leave the surface failure looking like a municipal defect. The first inspection should ask who last excavated the trench. Many cities now require a road cutting permission and a restoration deposit. Those papers are obtainable through RTI if restoration has failed.",
        ],
      },
      {
        heading: "How to identify the owner",
        paragraphs: [
          "Look at the name boards at the start of the stretch. Highway sections often have NH or SH stones, kilometre markers, and a different quality of median. Municipal roads may have ward numbers painted on electric poles. Satellite maps help you describe the stretch between two junctions, which is how engineers record works.",
          "Call or write to the municipal ward office with the PIN code and a photograph of the nearest landmark. If they reply that the road is not on their inventory, ask them to name the agency that holds it. Get that in writing. Then file or transfer the complaint to that agency. CivicConnect’s directory is a starting map of municipal, traffic and utility desks. It cannot list every highway package, so a one-line confirmation from the ward office is still gold.",
          "For footpaths, storm-water drains along the road, and street lights, ownership can again split. A municipal light on a PWD road is common. In that case, the light complaint goes to the corporation’s electrical wing even if the pothole goes to PWD. Bundle them as two complaints, not one confused letter.",
        ],
      },
      {
        heading: "After you know the owner",
        paragraphs: [
          "Ask for a temporary safety measure if the defect is dangerous: barricades, a steel plate, or lighting at night. That is a legitimate request even while the estimate for permanent repair is pending. Photograph the hazard with a date. If an accident occurs, those images and the complaint number become part of the public record.",
          "Do not fill the hole yourself with construction debris. That can block drains and create liability. Resident welfare associations sometimes fund a stop-gap; even then, inform the owner so the work is not treated as unauthorised.",
          "Escalation follows the owning agency’s ladder, not the neighbour’s WhatsApp group. A highway defect goes to the project implementation unit or the toll concessionaire’s maintenance camp. A municipal defect goes to the ward engineer. Mixing the two is the most common reason a genuine complaint sits unanswered.",
        ],
      },
    ],
  },
  {
    slug: "electricity-complaints-cgrf-and-ombudsman",
    title: "Electricity complaints in India: from the DISCOM helpline to CGRF and the Ombudsman",
    excerpt:
      "How consumer grievance forums work for billing, outages and safety, and why they are different from a municipal complaint.",
    category: "Electricity",
    publishedAt: "2026-07-28",
    readingMinutes: 8,
    image: civicImages.power,
    imageAlt: "Electrical infrastructure in an Indian city",
    sections: [
      {
        heading: "Start with the licensee’s own complaint system",
        paragraphs: [
          "Electricity distribution in Indian cities is run by DISCOMs — State utilities or private licensees. They are required to run 24x7 complaint centres, register a docket number, and meet Standards of Performance notified by the State Electricity Regulatory Commission. Those standards usually set hours for restoring supply after a fuse-off, a snapped conductor, or a transformer failure.",
          "Keep the docket number. If a crew does not arrive, call again and add a reminder on the same number. Parallel municipal emails will not energise a transformer. CivicConnect routes power-related issues to the mapped electricity desk where the city is in our directory. That is the first official trail, not the last.",
        ],
      },
      {
        heading: "When the DISCOM does not close the case",
        paragraphs: [
          "The Electricity Act provides for a Consumer Grievance Redressal Forum at the DISCOM level. CGRF typically hears billing disputes, delay in new connections, unsafe installations, and failure to meet performance standards. You file a petition with copies of the complaint docket, bills, and photographs. Forums publish sitting dates. Many allow appearance without a lawyer.",
          "If you are unhappy with the CGRF order, the next statutory step is the Electricity Ombudsman for that State. The Ombudsman is not a general anti-corruption office. It reviews whether the licensee and the forum applied the regulations. Orders can include restoration, bill revision, and compensation as per the standards of performance.",
          "Compensation is often modest per hour of outage, but the principle matters. It forces the utility to treat the docket as a legal clock, not a call-centre statistic. Check your State commission’s website for the exact form, fee if any, and limitation period.",
        ],
      },
      {
        heading: "Safety is not a billing dispute",
        paragraphs: [
          "A live wire on the road, a leaning pole, or a smoking transformer is an emergency. Call the DISCOM emergency number and, if there is immediate danger to life, the police. Do not wait for CGRF. After the site is made safe, you can still use the docket and photographs for a standards-of-performance claim.",
          "Street lights on municipal poles are a frequent grey area. The fixture and energy charges may be municipal, while the high-tension feeder is the DISCOM’s. If the whole feeder is down, it is a supply complaint. If only the decorative poles on a park path are dark, it is usually municipal electrical maintenance.",
          "Keep copies of every docket. Electricity paper trails are stronger than most civic files because the law already requires numbered complaints and time limits. Use that structure. Do not restart the story as a fresh “please help” mail to a minister unless the statutory path has been tried.",
        ],
      },
    ],
  },
  {
    slug: "water-supply-who-to-call-and-what-to-record",
    title: "Water supply complaints: municipal taps, jal boards, and what to record before you call",
    excerpt:
      "Low pressure, contamination and sewer overflows need different desks. A small field record makes the complaint usable.",
    category: "Water",
    publishedAt: "2026-08-01",
    readingMinutes: 7,
    image: civicImages.water,
    imageAlt: "Urban water infrastructure",
    sections: [
      {
        heading: "Find the operator, not just the brand on the tanker",
        paragraphs: [
          "In some cities the municipal corporation still runs water and sewerage. In others a jal board, water supply and sewerage board, or a contracted operator treats and pumps water while the corporation handles only billing or last-mile pipes. Tanker water during shortage may come from yet another cell. Your complaint must name the operator that owns the asset you are pointing at: the street main, the booster, the sewer manhole, or the treatment plant smell.",
          "Ward maps and consumer account numbers help. A water bill usually prints a unique ID, the zone, and a complaint number. Quote those. Photographs of a dry tap are weak unless you also note the scheduled supply hours for your area. Many cities publish a supply roster. If water is due between 6 and 8 a.m. and nothing arrived, say so.",
        ],
      },
      {
        heading: "Contamination and overflow are urgent",
        paragraphs: [
          "Discoloured water, a sewage smell from a drinking tap, or a mix-up after a nearby sewer repair is a public health issue. Call the operator’s emergency number, inform the ward health or sanitary inspector, and avoid using the water for drinking until you are told it is safe. If several households are affected, a joint complaint with a simple list of house numbers is stronger than twenty separate stories.",
          "Open sewage on the street is usually a municipal or jal board sewerage function, not an electricity or traffic issue. If a blocked trunk sewer is backing up into homes, ask for a jetting machine and an inspection of the downstream manhole. Photograph the overflow with a landmark. Do not enter manholes.",
          "Private borewells and illegal hook-ups complicate the picture. The operator may say pressure is low because of theft on the main. That can be true. It does not excuse a dry scheduled supply. Ask, in writing, for the residual pressure at the nearest public standpost or bulk meter if one exists.",
        ],
      },
      {
        heading: "Billing and connections",
        paragraphs: [
          "Meter disputes, sewerage cess on a dry plot, and delay in a new connection follow the operator’s citizen charter. Some States have a water regulator or an appellate committee. Others only have the municipal grievance cell. Read the back of the bill. It often prints the next office to write to.",
          "When you use CivicConnect, pick the water category so the mail goes to the water desk we have mapped for that city, not to the roads engineer. Attach the consumer ID in the description. A tracking ID plus a consumer ID is a complete handle for the utility’s software.",
          "Long-term shortage is a policy and infrastructure issue: sources, treatment capacity, and leakage. Individual complaints still matter because they document which colonies were dry on which dates. That record helps resident groups when they later seek a capital work or a tanker roster in the budget.",
        ],
      },
    ],
  },
  {
    slug: "how-to-read-a-city-budget-document",
    title: "How to read a city budget document in one evening",
    excerpt:
      "A practical method to open a municipal budget book, find your ward, and spot repeated promises that never became works.",
    category: "Municipal finance",
    publishedAt: "2026-08-04",
    readingMinutes: 7,
    image: civicImages.mumbai,
    imageAlt: "Dense Indian city neighbourhoods",
    sections: [
      {
        heading: "Get the right file",
        paragraphs: [
          "Search for the corporation’s “budget estimates” for the current financial year and the “revised estimates” or actuals for the previous year. Cities also publish a budget speech. The speech is politics. The annexures are the work. If the website is poor, file an RTI for the budget volume and the ward-wise works list. Ask for a machine-readable copy if they already have a spreadsheet.",
          "Ignore vanity charts until you have three tables: receipts, revenue expenditure, and capital expenditure. Note whether capital spending is funded by grants, loans, or own surplus. A city that funds roads only from a closing grant will stop work when the grant is delayed.",
        ],
      },
      {
        heading: "Find your geography",
        paragraphs: [
          "Look for ward numbers, assembly constituencies, or zone names. Some budgets list “Ward 22 — CC road from A to B — Rs 40 lakh.” Others hide works under a generic “zonal roads.” Generic heads are harder to track. If your ward has no named work for three years, that is a finding. It may be fair if the ward was fully rebuilt last cycle. It may also mean the ward is politically weak.",
          "Compare the same line item across two years. “Desilting of major nala” appearing every year with the same round figure can be a standing maintenance contract, which is legitimate, or a copy-paste estimate. The actuals column tells you which. If actuals are near zero, the line is a wish.",
        ],
      },
      {
        heading: "Turn reading into action",
        paragraphs: [
          "Write down the page number, the scheme name, and the amount. When you file a CivicConnect complaint about that stretch, mention that the work appears in the budget book. When you meet the councillor, carry that page. You are not alleging fraud. You are asking why a listed work has no presence on the street.",
          "Loans and public-private partnerships have extra documents: concession agreements, annuity payments, and user charges. Those are harder to read but they explain why a flyover is lit while the service road is dark. The lighting may be in a different contract.",
          "Set aside one evening a year after the budget is passed. Residents’ associations that do this become the people officers expect to see. The budget will never be a novel. It can still be a map.",
        ],
      },
      {
        heading: "What the numbers will not shout",
        paragraphs: [
          "Salary heads, pension provisions and electricity bills for pumping stations often dwarf the line you care about. That is normal. Your job is not to rewrite the payroll. It is to see whether your street appears at all, and whether last year’s similar line was spent.",
          "If two neighbouring wards have named capital works and yours has only “miscellaneous repairs,” ask the councillor for the zonal priority list. Bring the tracking ID of an open CivicConnect complaint so the discussion is about a live file, not a general grievance. One evening with the annexure is enough to stop treating the city budget as a rumour.",
        ],
      },
    ],
  },
  {
    slug: "ward-committees-and-area-sabhas",
    title: "Ward committees and area sabhas: how neighbourhood voice is supposed to work",
    excerpt:
      "What Indian municipal law promised at the street level, what actually meets, and how residents can still put an item on a local agenda.",
    category: "Civic rights",
    publishedAt: "2026-08-08",
    readingMinutes: 7,
    image: civicImages.park,
    imageAlt: "Neighbourhood public space in an Indian city",
    sections: [
      {
        heading: "The missing middle of city government",
        paragraphs: [
          "The 74th Amendment imagined a chain from the voter to the ward to the municipal house. Several State laws then created ward committees for large cities and, in a few States, area sabhas for smaller neighbourhoods. The intent was that people would not have to travel to headquarters for a street light. Implementation has been uneven. Some cities hold regular ward committee meetings. Others have committees only on paper.",
          "Where they function, ward committees typically include the councillor and nominated members. They can review local works, sanitation beats, and complaint pendency. They cannot usually rewrite the city budget, but they can recommend a priority list. That list matters when the zonal engineer prepares the next estimate.",
        ],
      },
      {
        heading: "How to use a meeting that actually happens",
        paragraphs: [
          "Ask the councillor’s office for the schedule. Arrive with one page: location, photographs, tracking ID, and a single ask — inspection, jetting, a barricade, or a named estimate. Do not bring a manifesto. Committees run on lists of works, not on speeches.",
          "If the committee does not meet, ask for the grievance day at the zonal office. Many commissioners still hold a weekly janata darbar. Take the same one-pager. Note who sat on the dais and what they said. Follow up in writing the next day quoting that date.",
          "Residents’ welfare associations can request to be heard as a group if several buildings share a drain. A group request should still name a coordinator and a single correspondence address. Officers will not reply to twenty emails with twenty versions of the truth.",
        ],
      },
      {
        heading: "When there is no forum",
        paragraphs: [
          "Then the paper trail is the forum. File the complaint, wait the charter period, escalate to the zonal head, and copy the councillor. Publish only what is already on the public tracking page. Avoid circulating officials’ personal numbers.",
          "Some States have revived mohalla sabhas or area sabhas during specific missions. If your city announces one, treat it as a rare chance to get a work into the next estimate cycle. Bring the previous year’s photographs to show that the problem is not new.",
          "Neighbourhood voice is not a substitute for engineering. A sabha cannot design a trunk drain. It can insist that the drain is on this year’s list and that last year’s contractor is not paid for work that is not visible. That is enough.",
        ],
      },
      {
        heading: "Put the tracking ID on the agenda paper",
        paragraphs: [
          "If the secretary prepares a list of issues, send your item three days early: location, photographs, CivicConnect ID, and a single proposed action. Late verbal additions get lost in the minutes. Ask for the minutes by email. If minutes are not issued, write your own note the same evening and copy the councillor’s office. That note becomes the record that the issue was raised.",
          "Ward committees fail most often from empty chairs, not from hostile law. Showing up with a short file is how residents keep the middle layer of city government from remaining a heading in a statute book.",
        ],
      },
    ],
  },
  {
    slug: "cpgrams-and-state-grievance-portals",
    title: "CPGRAMS and State grievance portals: when to use the national desk",
    excerpt:
      "How the Centralised Public Grievance Redress and Monitoring System and State CM dashboards fit with a local municipal complaint.",
    category: "Citizen action",
    publishedAt: "2026-08-11",
    readingMinutes: 8,
    image: civicImages.jaipur,
    imageAlt: "Public institutions and civic streets",
    sections: [
      {
        heading: "Local first, national second",
        paragraphs: [
          "CPGRAMS is the Government of India’s public grievance system. It is useful when a Central ministry, a Central public sector utility, or a scheme administered from Delhi is involved. It is a weak first stop for a neighbourhood pothole. The portal will usually forward the grievance to the State or the municipal body, adding a delay.",
          "File locally first. Keep the municipal or DISCOM number. If that number goes cold, a CPGRAMS or State CM dashboard entry that quotes the local number is a reminder from above, not a replacement investigation.",
        ],
      },
      {
        heading: "State dashboards",
        paragraphs: [
          "Many States run a chief minister’s helpline, an app, or a web dashboard. These systems assign a State-level ID and ask the district collector or municipal commissioner for an Action Taken Report. The quality of those reports varies. Some are genuine inspections. Some are one-line closures. Always ask for the inspecting officer’s name and the date of visit.",
          "If a portal marks your grievance “resolved” and the defect is still there, reopen it with a dated photograph. Do not open a brand-new ticket with a new story. Duplicate tickets dilute the record. CivicConnect’s tracking ID can be pasted into the State portal’s description so both systems point to the same facts.",
        ],
      },
      {
        heading: "When the Central system is the right door",
        paragraphs: [
          "Use CPGRAMS first when the owning body is Central: a National Highway stretch under NHAI, a railway colony drain, a Central university campus road, a CGHS dispensary, or a service run by a Central board. In those cases the municipal corporation may only be a neighbour, not the owner. Filing only with the city delays the file.",
          "If you are unsure, file the local CivicConnect complaint anyway and say in the text that ownership may be Central. Then file CPGRAMS naming the likely ministry. The two IDs should appear in each other’s descriptions so an officer who opens either file sees the other.",
        ],
      },
      {
        heading: "What these portals cannot do",
        paragraphs: [
          "They cannot create a budget head. They cannot jump a tender. They cannot order a contractor to mobilise if the work order itself is stuck in finance. They can ask why a registered complaint has no inspection. Use them for silence and false closure, not for redesigning the city’s drainage master plan.",
          "Be accurate. Portals that detect abusive or identical copy-paste complaints deprioritise them. Write the location, the local ID, and the remaining defect in plain sentences. Attach one wide photograph and one detail photograph if the portal allows uploads. Paste the CivicConnect tracking ID in the first paragraph, not in a later comment that officers may never open.",
          "Think of CPGRAMS and CM dashboards as a second stamp on a file that already exists. The first stamp is the local desk. CivicConnect is built to create that first stamp and to keep it visible while you climb. National and State portals work best as reminders, not as the only record of a neighbourhood defect.",
        ],
      },
    ],
  },
  {
    slug: "evidence-photographs-and-tracking-ids",
    title: "Evidence that works: photographs, landmarks and tracking IDs for civic cases",
    excerpt:
      "How to document a civic defect so an engineer, a councillor or a forum can act without visiting twice.",
    category: "Citizen action",
    publishedAt: "2026-08-14",
    readingMinutes: 7,
    image: civicImages.traffic,
    imageAlt: "City street scene suitable for civic documentation",
    sections: [
      {
        heading: "Show the place, not only the damage",
        paragraphs: [
          "A close-up of a hole could be anywhere. A useful civic photograph includes a landmark: a shop sign, a kilometre stone, a bus stop number, a building name, or a junction board. Take one wide shot and one detail shot. If it is safe, include a recognisable object for scale. Do not stand in traffic to get the perfect frame.",
          "Record the time. Phone metadata helps, but a newspaper date or a screenshot of the complaint confirmation is stronger in disputes. If the defect is worse at night, say so and take a night photograph of the unlit stretch.",
        ],
      },
      {
        heading: "Keep the file small and official",
        paragraphs: [
          "CivicConnect compresses complaint photographs so they stay under 200 KB each. That is enough for identification and kind to public servers. You can keep a higher-resolution copy on your own phone for later. Do not upload dozens of near-identical frames. Three clear images beat thirty.",
          "Write the location as an engineer would: road name, between two junctions, landmark, PIN code, and ward if you know it. PIN code matching is how many desks, including CivicConnect, decide which office receives the mail.",
        ],
      },
      {
        heading: "The tracking ID is part of the evidence",
        paragraphs: [
          "Once you have a CivicConnect tracking ID, use it everywhere: RTI applications, councillor notes, and State portals. Ask family members not to file a second complaint with a new story. Multiple IDs for one crater look like spam and split the inspection.",
          "If the status changes to acknowledged or in progress, photograph the site again after two weeks. Before-and-after pairs are how you challenge a false closure. If a crew filled the hole with mud that washed away, the second photograph is the case.",
          "Never stage a hazard or move barricades for a picture. Never harass field staff on camera. The record should show the defect and the public process, not a confrontation. That is the difference between civic evidence and noise.",
        ],
      },
      {
        heading: "Keep a short log, not a long argument",
        paragraphs: [
          "A one-page diary is more useful than a five-minute voice note. Write the date, the number you called, the name or designation if you were given one, and what you were told. If nobody answered, write that too. Helpline recordings are rarely shared with you; your contemporaneous note is what you still hold.",
          "Avoid photographing bystanders’ faces, shop interiors, or private courtyards. You need the public defect and a public landmark. If a person is accidentally in the frame, crop before you upload. Do not circulate officials’ personal mobile numbers in group chats. Use the desk email and the tracking ID.",
          "Share the CivicConnect public tracking page with your residents’ association rather than forwarding a pile of raw images. One common file stops neighbours from inventing a second complaint with different measurements. Evidence is a civic tool when it is consistent, dated, and kind to the people who have to act on it.",
        ],
      },
    ],
  },
  {
    slug: "property-tax-and-civic-questions-you-can-ask",
    title: "Property tax, water charges and the civic questions you are allowed to ask",
    excerpt:
      "What your tax bill funds, what it does not, and how to query an assessment or a charge without mixing it up with a pothole complaint.",
    category: "Municipal finance",
    publishedAt: "2026-08-17",
    readingMinutes: 7,
    image: civicImages.city,
    imageAlt: "Urban housing and municipal streets",
    sections: [
      {
        heading: "Tax is not a personal repair contract",
        paragraphs: [
          "Paying property tax does not buy a private claim over the asphalt in front of your gate. It funds a pool of municipal services. That said, you are entitled to know how the city assesses property, what rebates exist, and whether a charge on the bill is authorised. Those are billing and assessment questions. A pothole is a works question. Mixing them in one angry paragraph delays both.",
          "Assessment methods vary: unit area, capital value, or older rental value systems. If your tax jumped after a revision, ask for the calculation sheet and the notification of the revision. If a vacant plot is billed as occupied, ask for the inspection note. These are record requests. RTI or the tax department’s citizen charter usually covers them.",
        ],
      },
      {
        heading: "Water and sewerage charges",
        paragraphs: [
          "Metered water should match consumption. If the meter is stuck or inaccessible, the operator’s rules say how a provisional bill is calculated. Challenge the method with the previous year’s average and a photograph of the meter reading. Sewerage cess on a plot without a sewer line is a common dispute; ask for the notification that applies the cess to your street.",
          "Do not withhold tax as a protest over a pothole unless you have legal advice. Unpaid tax can block permissions and invite recovery. Protest with a complaint file and a budget extract instead.",
        ],
      },
      {
        heading: "Use two files, not one",
        paragraphs: [
          "File the civic defect through the works or utility desk — CivicConnect if it maps your city — and keep the tax query with the revenue department. In the civic complaint, you may mention that you are a taxpayer in the ward. That is context. It is not a substitute for the location and the tracking ID.",
          "If a rebate is promised for senior citizens, women, or green buildings, read the current year’s notification. Old WhatsApp forwards are often expired. Ask the helpdesk to print the clause.",
          "Healthy civic culture treats tax as the price of a shared city and complaints as the way to check delivery. You can insist on both without turning every bill into a street fight.",
        ],
      },
      {
        heading: "What you can ask in writing",
        paragraphs: [
          "You can ask how your property was classified, which notification set the rate, whether an exemption was applied, and which ward or zone the bill is booked against. You can ask for the receipt number of last year’s payment if the portal shows arrears you have already paid. Keep copies. Revenue disputes are won on receipts, not on volume.",
          "You cannot demand that your tax be spent only on your lane. You can demand that the works wing answer a tracked complaint about that lane. CivicConnect is for the second demand. The tax office is for the first. Separate desks, separate sentences, better outcomes.",
        ],
      },
    ],
  },
  {
    slug: "tenders-unfinished-works-and-public-contracts",
    title: "Tenders, unfinished civic works and how citizens can follow a public contract",
    excerpt:
      "How to find a tender, read a work order, and ask why a contractor’s board is still on a road that was supposed to be finished last year.",
    category: "Transparency",
    publishedAt: "2026-08-20",
    readingMinutes: 8,
    image: civicImages.night,
    imageAlt: "City infrastructure at dusk",
    sections: [
      {
        heading: "The public trail of a civic work",
        paragraphs: [
          "A typical municipal work moves from estimate to tender to work order to execution to bill. Each step leaves a paper. The tender may be on the State e-procurement portal. The work order names the contractor, the value, and the time allowed. The site should display a board with those details. If the board is missing, that is a small but useful complaint of its own.",
          "Search the e-procurement site by department and keyword — “CC road”, “desilting”, “street light” — plus the ward or zone. Download the notice. You do not need to bid. You need the tender ID so you can ask, later, which work order was issued.",
        ],
      },
      {
        heading: "Delay has official names",
        paragraphs: [
          "Engineers grant extension of time for rain, utility shifting, or court stay. Those extensions should be on file. If a work has been “almost complete” for a year, ask for the latest extension order and the hindrance register. RTI is the right tool. A social media accusation of theft, without the file, is weaker and riskier.",
          "Unpaid bills also stall sites. A contractor who has not been paid for a certified measurement may slow down. That is a finance problem. Citizens can still ask whether the measurement was certified and whether funds were released. The answer tells you whether to push the engineer or the accounts wing.",
        ],
      },
      {
        heading: "Safety during unfinished work",
        paragraphs: [
          "Open trenches, missing barricades, and dark diversions are immediate hazards. Complain for safety even if the contract dispute is unresolved. Photographs of an unlit diversion at night belong in that complaint. The owning department must protect the public while the contract is alive.",
          "When the work is finally billed, utilisation certificates and completion certificates close the loop. If a new pothole appears on a freshly billed stretch, quote the completion date. Defect liability periods exist in many contracts. The contractor may still be obliged to repair.",
          "Public contracts are slow by design because they spend public money. They are not allowed to be invisible. A tracking ID for the surface defect, plus a tender ID for the underlying work, is a complete citizen file. That is how unfinished civic work is brought back onto an officer’s desk.",
        ],
      },
      {
        heading: "How to ask without accusing",
        paragraphs: [
          "Write to the executive engineer of the division that issued the work order. Quote the tender ID, the stipulated date of completion, and what you see on the ground. Ask for the latest extension of time and the reason recorded in the hindrance register. That is a request for records. It is stronger than a public allegation that money was stolen.",
          "If the site is unsafe tonight, file a CivicConnect complaint for barricades and lighting first. The contract file can wait a day. Residents who separate the hazard from the audit get both a safer street and a cleaner paper trail.",
        ],
      },
    ],
  },
  {
    slug: "citizen-charters-and-service-timelines",
    title: "Citizen charters and service timelines: what a city office actually promised",
    excerpt:
      "How to find the time limit for a drain inspection or a water reconnection, and what to do when the clock runs out without a visit.",
    category: "Civic rights",
    publishedAt: "2026-08-22",
    readingMinutes: 8,
    image: civicImages.gateway,
    imageAlt: "Public building and civic square in an Indian city",
    sections: [
      {
        heading: "A charter is a published promise, not a rumour",
        paragraphs: [
          "Most municipal corporations, water boards and electricity licensees publish a citizen charter. It is a table of services with a time limit: how many days for a new water connection, how many hours to restore a snapped line in an urban area, how many days to inspect a reported overflow. The numbers are not folklore from a WhatsApp group. They are the office’s own statement of what it will try to do.",
          "Charters sit on the civic body’s website, in the handbook at the zonal counter, or as a board in the waiting hall. If you cannot find one, ask for it under the Right to Information Act as the current citizen charter and the office that last revised it. A missing charter is itself a finding. An outdated charter is still useful: it shows what the department once thought was reasonable.",
        ],
      },
      {
        heading: "Match the service to the clock",
        paragraphs: [
          "Complaints fail when the citizen quotes the wrong row. A pothole on an internal road is not the same service as restoration after a water-main burst. A street-light outage may have a 48-hour urban target while a new light installation waits for a capital estimate. Read the heading. Write that heading in your complaint so the desk cannot pretend you asked for a different job.",
          "Some charters distinguish acknowledged, inspected and completed. Acknowledgement in 24 hours is not the same as repair in 24 hours. If the portal shows “closed” after a phone call and no visit, the charter’s inspection row is the one you should quote when you reopen the case.",
          "Utilities often have separate documents: a Standards of Performance regulation for electricity, a water board circular for tanker supply during a shutdown, a traffic police SOP for a non-working signal. Those documents bind the licensee more tightly than a municipal pamphlet. Use the specialised clock when the defect is power, water pressure, or a signal, not the city’s generic “grievance” row.",
        ],
      },
      {
        heading: "When the time has passed",
        paragraphs: [
          "Wait the published period unless there is immediate danger. Then write a short reminder that names the charter clause, the original tracking ID, and the date the clock started. Attach one new photograph if the defect is unchanged. This is not a new complaint. It is the same file, now overdue.",
          "If the office has a designated appellate officer or a next-level email in the charter, use that address next. Many charters print a name that has since been transferred. Address the designation — Superintending Engineer, Zonal Commissioner, Customer Care head — and keep the tracking ID in the subject line.",
          "Compensation clauses exist in some electricity and water regulations when a standard is missed. Claiming them is a separate, document-heavy process. Do not mix a compensation claim into a first civic complaint; it slows the field visit. File the defect, get the inspection, then ask about compensation with the inspection note in hand.",
        ],
      },
      {
        heading: "How CivicConnect fits the clock",
        paragraphs: [
          "CivicConnect records the day you filed and emails the matched desk. That date is your start of the charter clock for practical purposes, even if the civic body’s own portal later issues a second number. Quote both numbers if you receive two. Officers search whatever ID their inward register captured.",
          "A charter will not fill a pothole by itself. It gives you a fair sentence to write when silence has lasted longer than the office’s own table. That sentence, plus a tracking ID and a landmark photograph, is how a neighbourhood defect moves from a private annoyance to an overdue public file.",
        ],
      },
    ],
  },
  {
    slug: "solid-waste-source-segregation-and-open-dumping",
    title: "Solid waste, source segregation and how to report open dumping that never moves",
    excerpt:
      "What Indian municipal solid-waste rules expect from households and from the city, and how to document a dump so the conservancy desk cannot call it a one-day pile.",
    category: "Civic awareness",
    publishedAt: "2026-08-24",
    readingMinutes: 8,
    image: civicImages.mumbai,
    imageAlt: "Dense Indian city streets and public cleanliness",
    sections: [
      {
        heading: "The city cannot collect what you have not separated",
        paragraphs: [
          "Solid Waste Management Rules require urban local bodies to arrange door-to-door collection and processing. They also require generators — households, shops, and bulk producers such as hotels — to segregate waste at source. A complaint that “nobody comes” is weaker if the lane still mixes wet food, plastic and construction debris in one heap. Crews that are instructed to collect only segregated waste will skip a mixed pile, and the skip looks like neglect when it is also a rules dispute.",
          "Ask the ward office which streams they collect on which days: wet, dry, domestic hazardous, and construction debris. Write those days in your complaint if a scheduled vehicle did not arrive. A missed Tuesday wet-waste round is a service failure. A mixed pile left on Wednesday because the dry vehicle was not due is a different sentence.",
        ],
      },
      {
        heading: "Open dumping is a location problem",
        paragraphs: [
          "Vacant plots, nala edges, and the back of a market attract dumping because they are poorly lit and poorly watched. Photograph the heap with a landmark, then a closer shot that shows whether it is household waste, debris, or slaughter waste. Those three streams go to different contractors. A generic “garbage” ticket often lands on the wrong beat.",
          "If the dump sits on private land, the municipal conservancy wing may still have a duty to prevent public nuisance, but it may also need a notice to the owner. Say so in the complaint if you know the plot is private. If it sits on a storm drain, mention flooding risk. Engineers respond faster to a blocked nala than to an aesthetic complaint.",
          "Recurring dumps need a date series, not a single angry photograph. Take a wide shot on three separate days. If a sweeper moved the heap five metres, that is not clearance. Your series shows persistence. CivicConnect’s tracking ID should stay the same across those updates so the file is one dump, not three rumours.",
        ],
      },
      {
        heading: "Bulk generators and user charges",
        paragraphs: [
          "Hotels, hospitals, wedding halls and large housing societies are bulk generators. Many cities require them to process wet waste on site or to pay a user charge for a dedicated collection. If a hotel’s bags appear on a public corner every night, name the establishment and the time. The health or conservancy inspector has a different lever than the lane sweeper.",
          "User charges on the property-tax bill sometimes fund a private conservancy contract. If the contractor’s board is on the truck, note the name. Your complaint can then ask whether that contract’s beat list includes your street. A missing beat is a contract-management issue, which is why the zonal officer, not only the sweeper, needs the mail.",
        ],
      },
      {
        heading: "What residents can do without becoming the contractor",
        paragraphs: [
          "Segregate at home. Keep construction debris off the municipal heap; book a debris vehicle if the city offers one. Do not burn plastic. Do not shift a dump onto the next society’s wall. Those acts create new complaints and destroy your standing.",
          "Then use the official path: a CivicConnect complaint to the municipal desk with photographs, the beat day, and the tracking ID. If the dump sits in a park, copy the parks wing in the text. If it sits on a State highway verge, say so, because the municipal beat may end at the kerb.",
          "Cleanliness is a shared duty written into municipal law and into household rules. The city’s failure does not cancel yours, and your segregation does not cancel the city’s collection duty. A dated file is how both sides are held to the same street.",
        ],
      },
    ],
  },
];

export function getLearnArticle(slug: string) {
  return learnArticles.find((article) => article.slug === slug) ?? null;
}

export function relatedLearnArticles(slug: string, limit = 3) {
  const current = getLearnArticle(slug);
  const others = learnArticles.filter((article) => article.slug !== slug);
  if (!current) return others.slice(0, limit);
  const sameCategory = others.filter((article) => article.category === current.category);
  const rest = others.filter((article) => article.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatArticleDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function wordCount(article: Article) {
  return article.sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}
