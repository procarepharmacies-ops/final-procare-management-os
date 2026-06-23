import os
import re
import csv
import glob

def parse_phy_file(file_path, output_csv):
    print(f"Processing {file_path}...")
    with open(file_path, 'rb') as f:
        data = f.read()

    # The format appears to be chunks of text with lots of space padding.
    # We will look for sequences of valid strings.
    # Since it's a proprietary binary format, this is a heuristic extraction.
    
    # Find all printable ASCII strings longer than 2 chars
    strings = re.findall(b'[A-Za-z0-9 \-\.\(\)\+]{3,}', data)
    
    # Decode strings
    decoded = []
    for s in strings:
        try:
            cleaned = s.decode('utf-8').strip()
            if cleaned:
                decoded.append(cleaned)
        except:
            pass

    # A very naive extraction just dumping the strings to CSV for manual mapping
    # In a real ETL, we'd find the exact byte offsets (e.g., 500 byte records)
    with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Extracted_String'])
        for d in decoded:
            writer.writerow([d])
            
    print(f"Extracted {len(decoded)} strings to {output_csv}")

def main():
    target_dir = r'D:\Labirdo\TITAN.W1\Files\DB'
    phy_files = glob.glob(os.path.join(target_dir, '*.phy'))
    
    for phy in phy_files:
        basename = os.path.basename(phy)
        output_csv = f"{basename}.csv"
        parse_phy_file(phy, output_csv)

if __name__ == '__main__':
    main()
