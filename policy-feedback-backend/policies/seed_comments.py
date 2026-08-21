import random
from django.contrib.auth.models import User
from policies.models import Policy, Comment

def run_seed():
    print("Starting seeding 100+ realistic citizen comments per policy...")
    
    # Get active policies
    p1 = Policy.objects.filter(id=1).first() or Policy.objects.filter(title__icontains='Biryani').first()
    p2 = Policy.objects.filter(id=2).first() or Policy.objects.filter(title__icontains='Wi-Fi').first()
    p3 = Policy.objects.filter(id=3).first() or Policy.objects.filter(title__icontains='Harvesting').first()

    if not p1 or not p2 or not p3:
        print("Error: Active policies not found. Ensure database has seeded policies.")
        return

    # 120 Unique Realistic Indian Citizen Account Usernames
    first_names = [
        "arun", "kavitha", "senthil", "priya", "natarajan", "divya", "balaji", "subramanian", "meena",
        "karthik", "anand", "lakshmi", "suresh", "revathi", "vijay", "deepa", "ganesh", "swetha",
        "murali", "nisha", "prakash", "sandhya", "ramesh", "gayathri", "venkat", "anitha", "kumaran",
        "radha", "siddharth", "bhuvaneshwari", "dinesh", "shalini", "gokul", "pooja", "saravanan",
        "aarthi", "manikandan", "kalpana", "harish", "soundarya", "ashok", "yamuna", "naveen",
        "geetha", "chithra", "babu", "keerthana", "prasanna", "uma", "kannan", "rajeswari",
        "shankar", "vaithegi", "bharathi", "muthu", "pavithra", "dhanush", "abirami", "senthamizhan",
        "vasanthi", "jagadeesh", "janani", "elan", "malathi", "raghavan", "preeti", "dharani",
        "mohan", "subha", "srikanth", "vidhya", "girish", "indumathi", "madhavan", "kousalya",
        "logesh", "mythili", "naveen", "nithya", "padmanabhan", "ragini", "sathish", "selvi",
        "thiru", "vaishnavi", "vinoth", "viji", "yogeswaran", "hema", "aravind", "gowri", "elango",
        "kalyani", "narayanan", "deepika", "jayakumar", "kaviyarasan", "menaka", "parthiban",
        "ramya", "santhosh", "suganya", "tamilarasan", "ushen", "vignesh", "yuvraj", "archana"
    ]

    towns = [
        "chennai", "madurai", "coimbatore", "trichy", "salem", "tirunelveli", "vellore", "erode",
        "thanjavur", "dindigul", "karur", "nagapattinam", "hosur", "kanchipuram", "tiruppur",
        "tuticorin", "cuddalore", "nagercoil", "kumbakonam", "rajapalayam", "pudukkottai"
    ]

    names = []
    for fn in first_names:
        tn = random.choice(towns)
        names.append(f"{fn}_{tn}")
        names.append(f"{fn}_{random.randint(10, 99)}")

    names = list(set(names))[:115] # 115 unique users

    display_titles = [
        "Daily Wage Worker", "Resident", "College Student", "Local Shop Owner",
        "Civil Engineer", "School Teacher", "IT Professional", "Social Worker",
        "Senior Citizen", "Homemaker", "Small Business Owner", "Research Scholar"
    ]

    # --- Policy 1: Affordable Biryani Shops ---
    p1_supportive = [
        ("Great initiative for daily wage workers and poor families who cannot afford costly hotel food.", "Affordability", "Provides cheap, highly nutritious meal options for low-income workers"),
        ("Highly supportive! Subsidized rice and chicken meal once a week brings huge financial relief.", "Affordability", "Helps low-income households cut down weekly food expenses"),
        ("Wonderful social welfare scheme. Healthy biryani for Rs.30 is a boon for college students.", "Affordability", "Provides cheap options for students and workers"),
        ("Extremely happy with this announcement. Low income labor class will benefit immensely.", "Affordability", "Directly targets poor families with subsidized staple meals"),
        ("Great move by government! Protein rich food at affordable price is much needed.", "Safety & Quality", "Ensures access to protein-rich food for vulnerable groups"),
        ("Full support to this initiative. Kindly expand this to all taluk headquarters as well.", "Accessibility", "Wants wider geographic reach across all taluk headquarters"),
        ("Appreciate this welfare scheme. Please maintain good quality rice and clean oil.", "Safety & Quality", "Requests strict food safety and hygiene standards"),
        ("Brilliant step for working class citizens. Solves afternoon lunch struggle for drivers and daily workers.", "Affordability", "Offers quick affordable lunch for transportation workers"),
        ("Very good scheme. Hygiene and cleanliness must be monitored regularly by food safety inspectors.", "Safety & Quality", "Emphasizes food safety inspection and cleanliness"),
        ("Heartfelt thanks for introducing this! Will help thousands of unorganized sector laborers.", "Affordability", "Supports unorganized sector laborers with subsidized food"),
    ]
    p1_mixed = [
        ("Good concept, but queue management at government outlets must be controlled properly.", "Accessibility", "Concern about crowd control and long lines at government stalls"),
        ("Affordable meal is great, but 1 shop per district is not enough for high population density.", "Accessibility", "One shop per district may not meet high population demand"),
        ("Price is reasonable, but food quality shouldn't drop after initial few months.", "Safety & Quality", "Cheap price shouldn't lead to low food quality over time"),
        ("Appreciate the effort, but token system should be introduced to avoid overcrowding.", "Accessibility", "Suggests token distribution to streamline crowd capacity"),
        ("Good scheme for poor, but please ensure plastic containers are avoided for hot food.", "Safety & Quality", "Raises health concern regarding plastic packaging for hot food"),
    ]
    p1_critical = [
        ("Government should focus on fixing public hospitals and schools instead of running biryani stalls.", "Resource Allocation", "Believes public funds are better spent elsewhere on healthcare"),
        ("Instead of subsidized food, increase minimum wages so workers can buy their own choice of food.", "Resource Allocation", "Prefers wage increase over government food subsidies"),
        ("Risk of corruption and food wastage if tender management is not transparent.", "Safety & Quality", "Concern over procurement transparency and food wastage"),
        ("One center per district will create massive traffic jams and overcrowding in main bus stands.", "Accessibility", "Concern about traffic congestion around central shop locations"),
    ]

    # --- Policy 2: Free Public Wi-Fi in Parks ---
    p2_supportive = [
        ("Public Wi-Fi routers in parks will help poor students study online without spending money on expensive 5G recharge packs.", "Affordability", "Providing free public Wi-Fi alleviates the financial burden of expensive mobile data for students"),
        ("Excellent idea! Students and job seekers can download study material peacefully in public parks.", "Accessibility", "Provides quiet public spaces with digital access for job seekers"),
        ("Great step towards digital inclusion! Helps low income citizens access government e-services.", "Accessibility", "Enhances digital access to government e-governance services"),
        ("Full support! High speed Wi-Fi in green parks encourages students to study in open fresh air.", "Accessibility", "Promotes outdoor learning in public park green zones"),
        ("Very progressive policy. Free internet in public places is standard in developed cities.", "General", "Praises modernization of public urban infrastructure"),
        ("Helpful for competitive exam aspirants who spend money at commercial internet cafes.", "Affordability", "Saves money for exam preparation aspirants"),
        ("Wonderful scheme! Park footfall will increase and community engagement will improve.", "Accessibility", "Increases public park usage and community interaction"),
    ]
    p2_mixed = [
        ("Good initiative, but router signal coverage must extend across the entire park area, not just near entrance.", "Accessibility", "Wants wider Wi-Fi coverage across more park locations"),
        ("Free Wi-Fi is helpful, but web filtering must block adult content and cyber threats.", "Safety & Quality", "Concern about network security, hacking, or data privacy"),
        ("Great for students, but speed capping per user is needed so one person doesn't hoard bandwidth.", "Resource Allocation", "Requests fair bandwidth allocation per user"),
        ("Useful move, but solar powered battery backup should be installed for power cut hours.", "Accessibility", "Wants uninterrupted power backup during grid power cuts"),
    ]
    p2_critical = [
        ("Instead of Wi-Fi, government should fix broken park benches, street lights, and drinking water taps first.", "Resource Allocation", "Believes funds should prioritize basic park infrastructure maintenance"),
        ("Free Wi-Fi in parks will attract anti-social elements and ruin the peaceful family environment.", "Safety & Quality", "Concern regarding park safety and nuisance for family visitors"),
        ("Cyber security risk! Unencrypted public Wi-Fi can lead to mobile hacking and data theft.", "Safety & Quality", "Highlights cyber security risks on open public Wi-Fi networks"),
    ]

    # --- Policy 3: Rainwater Harvesting Mandate ---
    p3_supportive = [
        ("Mandatory rainwater harvesting is essential for Chennai and all TN towns to recharge underground water table.", "Resource Allocation", "Wants to secure groundwater supplies for the future"),
        ("Strongly agree! Monsoon rainwater shouldn't drain into sea uselessly. Great environmental policy.", "Resource Allocation", "Prevents rainwater runoff waste into oceans"),
        ("Crucial policy for future generations. Underground water level has dropped drastically in our district.", "Resource Allocation", "Directly addresses declining groundwater levels"),
        ("Fully support! Government should also inspect old apartments and mandate filter maintenance.", "Safety & Quality", "Requests regular inspection of filtration systems in old buildings"),
        ("Necessary legislation to tackle summer drought crises in Tamil Nadu.", "Resource Allocation", "Mitigates recurring summer water scarcity crises"),
        ("Great environmental mandate. Subsidies for low income home owners will speed up adoption.", "Affordability", "Recommends financial subsidies for low-income homeowners"),
    ]
    p3_mixed = [
        ("Concept is necessary, but installation cost of RWH structure is high for middle class home owners.", "Affordability", "Worry about installation cost; requests financial subsidies"),
        ("Good policy, but local municipality must provide trained technicians for proper pit construction.", "Safety & Quality", "Requires technical guidance for effective pit design"),
        ("Harvesting is good, but without cleaning storm water drains, rainwater gets contaminated.", "Safety & Quality", "Concern over drainage contamination mixing with rainwater"),
    ]
    p3_critical = [
        ("Mandatory fine of Rs.5000 is too harsh for old houses without space for recharge pits.", "Affordability", "Believes penalty fine is excessive for space-constrained older properties"),
        ("Government municipal buildings themselves don't have working RWH pits. Practice before preaching.", "Resource Allocation", "Demands government buildings comply first before enforcing on public"),
    ]

    # Helper function to generate 100+ comments per policy
    def seed_policy_comments(policy, supportive_pool, mixed_pool, critical_pool, count=105):
        print(f"Seeding {count} comments for policy: {policy.title}...")
        
        user_objs = []
        for i, username in enumerate(names):
            u, _ = User.objects.get_or_create(username=username, defaults={'email': f'{username}@tn.gov.in'})
            user_objs.append(u)

        created_count = 0
        for i in range(min(count, len(user_objs))):
            user = user_objs[i]
            if Comment.objects.filter(policy=policy, user=user).exists():
                continue

            rand_val = random.random()
            if rand_val < 0.60:
                text, issue, why = random.choice(supportive_pool)
                sentiment = "Positive"
            elif rand_val < 0.85:
                text, issue, why = random.choice(mixed_pool)
                sentiment = "Mixed"
            else:
                text, issue, why = random.choice(critical_pool)
                sentiment = "Negative"

            author_title = random.choice(display_titles)
            author_display = f"{user.username.replace('_', ' ').title()} ({author_title})"

            Comment.objects.create(
                policy=policy,
                user=user,
                author=author_display,
                text=text,
                sentiment=sentiment,
                issue=issue,
                why=why
            )
            created_count += 1

        print(f"Successfully seeded {created_count} new citizen comments for '{policy.title}'. Total now: {Comment.objects.filter(policy=policy).count()}")

    seed_policy_comments(p1, p1_supportive, p1_mixed, p1_critical, count=110)
    seed_policy_comments(p2, p2_supportive, p2_mixed, p2_critical, count=110)
    seed_policy_comments(p3, p3_supportive, p3_mixed, p3_critical, count=110)

    print("Seeding complete! Total comments in DB:", Comment.objects.count())

if __name__ == '__main__':
    run_seed()
