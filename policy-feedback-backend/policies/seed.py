"""
Run this once to seed the database with the 3 initial policies and their comments.
Usage: python manage.py shell < policies/seed.py
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'policy_backend.settings')
django.setup()

from policies.models import Policy, Comment
from policies.analyzer import analyze_comment

# Clear existing data
Comment.objects.all().delete()
Policy.objects.all().delete()

SEED_DATA = [
    {
        "title": "Affordable Biryani Shops in Every District",
        "content": "A government-enabled biryani shop will operate in each district of Tamil Nadu and sell affordable biryani every Wednesday.",
        "comments": [
            {"author": "Person A", "text": "This is a great idea. Affordable food every Wednesday will help college students.", "ago": "2 mins ago"},
            {"author": "Person B", "text": "The idea is good, but I don't think one shop per district will be enough for large districts.", "ago": "5 mins ago"},
            {"author": "Person C", "text": "I don't support this. The government should focus on improving existing public food schemes instead.", "ago": "10 mins ago"},
            {"author": "Person D", "text": "Please make sure the biryani is hygienic and prepared properly. Cheap food shouldn't mean poor quality.", "ago": "15 mins ago"},
        ]
    },
    {
        "title": "Free High-Speed Wi-Fi Zones in Public Parks",
        "content": "The government will install free high-speed public Wi-Fi routers in all major municipal parks to help remote workers and students.",
        "comments": [
            {"author": "Student K", "text": "This is excellent! I can study in the fresh air and save money on my mobile data package.", "ago": "1 hour ago"},
            {"author": "Tech Guy", "text": "Public Wi-Fi is dangerous. Hackers can steal data. Is the network secure?", "ago": "2 hours ago"},
            {"author": "Taxpayer X", "text": "Waste of tax money. People will just watch movies in parks instead of working. Spend this on repairing roads!", "ago": "4 hours ago"},
        ]
    },
    {
        "title": "Mandatory Rainwater Harvesting in All Buildings",
        "content": "All residential and commercial properties in urban cities must install rainwater harvesting structures to replenish groundwater levels.",
        "comments": [
            {"author": "Green Earth", "text": "A highly necessary environmental step. Groundwater levels in Chennai are dropping too fast.", "ago": "1 day ago"},
            {"author": "Home Owner", "text": "The concept is great, but installing these units is expensive. The government should offer subsidies.", "ago": "2 days ago"},
        ]
    },
]

for policy_data in SEED_DATA:
    policy = Policy.objects.create(
        title=policy_data["title"],
        content=policy_data["content"],
    )
    for c in policy_data["comments"]:
        result = analyze_comment(c["text"])
        Comment.objects.create(
            policy=policy,
            author=c["author"],
            text=c["text"],
            sentiment=result["sentiment"],
            issue=result["issue"],
            why=result["why"],
        )
    print(f"Seeded: {policy.title} with {len(policy_data['comments'])} comments")

print("\nDatabase seeded successfully!")
