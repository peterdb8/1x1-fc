#!/usr/bin/env python3
"""
Parse Liverpool player data from HTML and copy highest-rated cards to Liverpool folder.
"""

import re
import os
import shutil
from pathlib import Path

# HTML data (truncated for brevity - you'll paste the full HTML)
html_data = """
[Your HTML table data here]
"""

def parse_player_data(html):
    """Extract player names and ratings from HTML table."""
    players = {}

    # Pattern to match player rows
    # Looking for: player name, rating number
    player_pattern = r'<a href="/player/\d+/\d+/([^"]+)">(.*?)</a>.*?<font class="[^"]*"[^>]*>(\d+)</font>'

    matches = re.findall(player_pattern, html, re.DOTALL)

    for url_name, display_name, rating in matches:
        rating = int(rating)
        # Clean up the display name
        clean_name = display_name.strip()

        # Keep only the highest rating for each player
        if clean_name not in players or rating > players[clean_name]:
            players[clean_name] = rating

    return players

def find_matching_card(player_name, rating, card_dirs):
    """Find the matching card file for a player."""
    # Normalize player name for filename matching
    # Replace spaces and special characters
    name_parts = player_name.replace("'", "").replace("-", "_").split()

    for card_dir in card_dirs:
        if not os.path.exists(card_dir):
            continue

        for filename in os.listdir(card_dir):
            if not filename.endswith('.png'):
                continue

            # Extract name and score from filename
            # Format: Name_Score.png
            base_name = filename.replace('.png', '')
            parts = base_name.rsplit('_', 1)

            if len(parts) == 2:
                file_player_name, file_score = parts

                # Check if player name matches
                # Simple check: all name parts are in the filename
                name_match = all(part.lower() in file_player_name.lower() for part in name_parts)

                if name_match and file_score == str(rating):
                    return os.path.join(card_dir, filename)

    return None

def main():
    # Read the actual HTML from your message
    # For now, let me create a simpler direct approach

    # Liverpool players with their highest ratings from your HTML
    liverpool_players = {
        "Virgil van Dijk": 95,
        "Mohamed Salah": 93,
        "Florian Wirtz": 92,
        "Ryan Gravenberch": 92,
        "Alexis Mac Allister": 91,
        "Denise O'Sullivan": 91,
        "Rio Ngumoha": 90,
        "Jeremie Frimpong": 90,
        "Dominik Szoboszlai": 90,
        "Hugo Ekitiké": 90,
        "Ibrahima Konaté": 89,
        "Cody Gakpo": 89,
        "Alexander Isak": 89,
        "Milos Kerkez": 89,
        "Conor Bradley": 88,
        "Joe Gomez": 87,
        "Federico Chiesa": 86,
        "Andrew Robertson": 86,
        "Wataru Endo": 84,
        "Curtis Jones": 80,
        "Harvey Elliott": 78,
        "Kostas Tsimikas": 77,
        # Women's team
        "Martha Thomas": 77,
        "Sophie Román Haug": 76,
        "Ceri Holland": 76,
        "Alejandra Bernabé": 75,
        "Gemma Bonner": 75,
        "Grace Fisk": 75,
        "Fuka Nagano": 75,
        "Gemma Evans": 74,
        "Lily Woodham": 74,
        "Marie Höbinger": 74,
        "Cornelia Kapocs": 73,
        "Leanne Kiernan": 73,
        "Stefan Bajcetic": 73,
        "Samantha Kerr": 72,
        "Aurélie Csillag": 71,
        "Owen Beck": 70,
        "Jenna Clark": 70,
        "Lewis Koumas": 69,
        "Giovanni Leoni": 69,
        "Mia Enderby": 69,
        "James McConnell": 68,
        "Sofie Lundgaard": 67,
        "Kirsty Maclean": 66,
        "Calvin Ramsay": 65,
        "Trey Nyoni": 64,
        "Lucy Parry": 63,
        "Rhys Williams": 61,
        "Hannah Silcock": 60,
        "Zara Shaw": 60,
        "Risa Shimizu": 79,
    }

    # Create Liverpool directory
    liverpool_dir = Path("Liverpool")
    liverpool_dir.mkdir(exist_ok=True)

    # Source directories for cards
    card_sources = ["assets/cards", "uploads"]

    copied_count = 0
    not_found = []

    for player_name, rating in liverpool_players.items():
        print(f"Looking for {player_name} (Rating: {rating})...")

        # Try to find matching card
        card_found = False
        for source_dir in card_sources:
            source_path = Path(source_dir)
            if not source_path.exists():
                continue

            # Look for files with the player name and rating
            for card_file in source_path.glob("*.png"):
                filename = card_file.name
                # Extract score from filename (last number before .png)
                match = re.search(r'_(\d+)\.png$', filename)
                if match:
                    file_score = int(match.group(1))
                    # Check if this matches our player and rating
                    name_normalized = player_name.replace("'", "").replace(" ", "_").replace("-", "_")
                    if name_normalized in filename.replace("'", "") and file_score == rating:
                        # Copy to Liverpool folder
                        dest_path = liverpool_dir / filename
                        shutil.copy2(card_file, dest_path)
                        print(f"  ✓ Copied {filename}")
                        copied_count += 1
                        card_found = True
                        break

            if card_found:
                break

        if not card_found:
            not_found.append(f"{player_name} ({rating})")
            print(f"  ✗ Not found")

    print(f"\n=== Summary ===")
    print(f"Total players: {len(liverpool_players)}")
    print(f"Cards copied: {copied_count}")
    print(f"Not found: {len(not_found)}")

    if not_found:
        print(f"\nPlayers not found:")
        for player in not_found:
            print(f"  - {player}")

if __name__ == "__main__":
    main()
