import requests
from bs4 import BeautifulSoup
import csv

def get_player_data(player_url):
    # Sayfa HTML'sini çek
    try:
        response = requests.get(player_url)
        response.raise_for_status()  # Eğer HTTP hata kodu varsa exception fırlatır
    except requests.exceptions.RequestException as e:
        print(f"Sayfa yüklenemedi: {player_url}, Hata: {e}")
        return None

    # BeautifulSoup ile HTML'i parse et
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Oyuncu bilgilerini çek
    player_info = {}
    try:
        # Temel bilgiler
        player_info["Ad"] = soup.find("h1", itemprop="name").text.strip()
        player_info["Ülke"] = soup.find("div", {"style": "color: #16387C;font-family: Arial; font-size: 16px; font-weight: bold;padding-top:5px"}).text.strip()
        player_info["Takım"] = soup.find("span", itemprop="name").text.strip()
        player_info["Piyasa Değeri"] = soup.find("div", style="font-size:14px").text.strip().split("EUR")[0].strip()
        
         # Pozisyon bilgisi
        position = soup.find("div", string="Pozisyon")
        if position:
            player_info["Pozisyon"] = position.find_next_sibling().text.strip()  # Pozisyon bilgisini al
            
        # Yaş bilgisi (Doğum Tarihi)
        birth_date_element = soup.find("time", itemprop="birthDate")
        if birth_date_element:
            player_info["Doğum Tarihi"] = birth_date_element.text.strip()
            # Sayfada yaş doğrudan verilmişse, onu çek
            age = birth_date_element.find_next_sibling(text=True)
            if age:
                player_info["Yaş"] = age.strip("()").strip()
    except Exception as e:
        print(f"Oyuncu bilgileri alınırken hata oluştu: {e}")

    # Oyuncu Pozisyonu Kontrolü (Kaleci mi?)
    position = soup.find("div", string="Pozisyon")
    if position and "K" in position.find_next_sibling().text:
        # Kaleci istatistiklerini çek
        print("Kaleci olduğu tespit edildi, kaleciye özel istatistikler çekilecek...")
        try:
            # Kaleciye özgü istatistikleri çek
            goalie_stats = {}

            # Kaleci istatistikleri
            stats_table = soup.find_all("tr", class_="opta-stat")
            if stats_table:
                # Kaleci istatistiklerini alıyoruz
                goalie_stats["Maç"] = stats_table[0].find_all("td")[0].text.strip()
                goalie_stats["GolYmdMaç"] = stats_table[0].find_all("td")[1].text.strip()
                goalie_stats["T.O.S."] = stats_table[0].find_all("td")[2].text.strip()

                goalie_stats["YG"] = stats_table[1].find_all("td")[0].text.strip()
                goalie_stats["YG/Kurt(CSI)"] = stats_table[1].find_all("td")[1].text.strip()
                goalie_stats["YG/Kurt(CSD)"] = stats_table[1].find_all("td")[2].text.strip()

                goalie_stats["Kurt.Yz"] = stats_table[2].find_all("td")[0].text.strip()
                goalie_stats["Kurt.Yz(CSI)"] = stats_table[2].find_all("td")[1].text.strip()
                goalie_stats["Kurt.Yz(CSD)"] = stats_table[2].find_all("td")[2].text.strip()

                player_info.update(goalie_stats)
        except Exception as e:
            print(f"Kaleciye özgü istatistikler alınırken hata oluştu: {e}")
    
    else:
        # Diğer oyuncular için genel istatistikler (kaleci olmayanlar)
        print("Kaleci değil, genel istatistikler çekilecek...")
        stats_card = soup.find("div", {"id": "optaCard"})
        if stats_card:
            stats = {}
            rows = stats_card.find_all("tr", class_="opta-stat")
            if rows:
                try:
                    # İlk satırdaki veriler
                    first_row = rows[0].find_all("td")
                    stats["Maç"] = first_row[0].text.strip()
                    stats["Gol"] = first_row[1].text.strip()
                    stats["Asist"] = first_row[2].text.strip()
                    stats["Şut/M"] = first_row[3].text.strip()

                    # İkinci satırdaki veriler
                    second_row = rows[1].find_all("td")
                    stats["İ.Ş/M"] = second_row[0].text.strip()
                    stats["Pas"] = second_row[1].text.strip()
                    stats["Drip./M"] = second_row[2].text.strip()
                    stats["T.K/M"] = second_row[3].text.strip()

                    # Üçüncü satırdaki veriler
                    third_row = rows[2].find_all("td")
                    stats["H.T.K/M"] = third_row[0].text.strip()
                    stats["İ.M.K"] = third_row[1].text.strip()
                    stats["B.P/M"] = third_row[2].text.strip()
                    stats["İ.O/M"] = third_row[3].text.strip()

                    player_info.update(stats)
                except Exception as e:
                    print(f"İstatistikler alınırken hata oluştu: {e}")
            else:
                print("İstatistik satırları bulunamadı!")
        else:
            print("İstatistik kartı bulunamadı!")

    return player_info

def save_to_csv(player_data, filename="player_datawithage.csv"):
    # CSV dosyasına yazma işlemi (utf-8-sig kodlaması ile)
    with open(filename, mode='a', newline='', encoding='utf-8-sig') as file:
        writer = csv.DictWriter(file, fieldnames=player_data.keys())
        
        # Dosyaya başlık satırı ekle (ilk defa yazıyorsak)
        if file.tell() == 0:
            writer.writeheader()
        
        # Oyuncu verisini dosyaya yaz
        writer.writerow(player_data)

if __name__ == "__main__":
    # Birden fazla oyuncu URL'si
    player_urls = [
     #linkler
    ]

    # Her oyuncu için verileri çek ve CSV dosyasına kaydet
    for url in player_urls:
        player_data = get_player_data(url)
        if player_data:
            save_to_csv(player_data)
            print(f"{player_data['Ad']} bilgileri başarıyla CSV dosyasına kaydedildi.")
        else:
            print(f"{url} linkindeki oyuncu bilgileri çekilemedi.")
