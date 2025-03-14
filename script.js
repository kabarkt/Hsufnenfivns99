 // Fungsi untuk memperbarui tanggal dan waktu secara real-time
    function updateDateTime() {
        try {
            const now = new Date();
            const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
            const dateString = now.toLocaleDateString('id-ID', dateOptions);
            const timeString = now.toLocaleTimeString('id-ID', { hour12: false });
            document.getElementById("currentDate").textContent = dateString;
            document.getElementById("currentTime").textContent = timeString;
        } catch (e) {
            document.getElementById("currentDate").textContent = "Error";
            document.getElementById("currentTime").textContent = "Error";
        }
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Fungsi untuk mengambil data dari API Aladhan
    async function fetchPrayerTimes() {
        try {
            const select = document.getElementById("citySelect");
            if (!select) {
                document.getElementById("timeTable").innerHTML = "<div class='error'>Elemen select tidak ditemukan</div>";
                return;
            }
            const [city, latitude, longitude] = select.value.split("|");
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;
            const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=5`;

            document.getElementById("timeTable").innerHTML = "<div class='loading'>Memuat jadwal...</div>";

            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.code === 200) {
                const times = data.data.timings;
                displayTimes(times);
            } else {
                document.getElementById("timeTable").innerHTML = "<div class='error'>Gagal memuat data dari API</div>";
            }
        } catch (error) {
            document.getElementById("timeTable").innerHTML = "<div class='error'>Kesalahan: " + error.message + "</div>";
        }
    }

    // Fungsi untuk menampilkan jadwal
    function displayTimes(times) {
        const timeTable = document.getElementById("timeTable");
        if (!timeTable) return;
        timeTable.innerHTML = `
            <div class="time-item">Imsak: <span>${times.Imsak}</span></div>
            <div class="time-item">Subuh: <span>${times.Fajr}</span></div>
            <div class="time-item">Terbit: <span>${times.Sunrise}</span></div>
            <div class="time-item">Dzuhur: <span>${times.Dhuhr}</span></div>
            <div class="time-item">Ashar: <span>${times.Asr}</span></div>
            <div class="time-item">Maghrib: <span>${times.Maghrib}</span></div>
            <div class="time-item">Isya: <span>${times.Isha}</span></div>
        `;
    }

    // Fungsi untuk toggle spoiler embed dan copy ke clipboard
    function toggleEmbedSpoiler() {
        const spoiler = document.getElementById("embedSpoiler");
        const embedCode = document.getElementById("embedCode");
        spoiler.classList.toggle("active");
        
        if (spoiler.classList.contains("active")) {
            const pageUrl = window.location.href; // Ganti manual jika perlu
            embedCode.value = `<div style="position: relative; width: 100%; height: 550px;">
    <!-- Preload Animation -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; z-index: 10;" id="preload">
        <div style="width: 50px; height: 50px; border: 5px solid #ccc; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </div>
    <!-- Iframe -->
    <iframe src="https://www.kabarakyat.web.id/p/imsakiah.html" width="100%" height="550" frameborder="0" onload="document.getElementById('preload').style.display='none';" style="position: relative; z-index: 1;"></iframe>
</div>`;
            embedCode.select();
            document.execCommand("copy");
        }
    }

    // Panggil fungsi saat widget dimuat
    setTimeout(fetchPrayerTimes, 1000);
