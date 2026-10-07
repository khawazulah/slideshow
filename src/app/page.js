"use client";
import { useState, useEffect } from "react";

export default function SlideshowPage() {
  const [images, setImages] = useState([]);
  
  // Ubah nilai awal currentIndex menjadi 1 karena index 0 diisi gambar terakhir (kloning)
  const [currentIndex, setCurrentIndex] = useState(1); 
  const [isPlaying, setIsPlaying] = useState(true);
  
  // State tambahan untuk mengontrol animasi "Infinite Loop"
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false); // Mencegah klik spam sebelum slide selesai

  // Mengambil gambar dari API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images');
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Gagal memuat gambar", error);
      }
    };
    fetchImages();
  }, []);

  // Logika Slideshow Otomatis
  useEffect(() => {
    let interval;
    if (isPlaying && images.length > 1) {
      interval = setInterval(() => {
        nextSlide();
      }, 10000); // Ganti tiap 10 detik
    }
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const nextSlide = () => {
    if (images.length <= 1 || isAnimating) return;
    setIsAnimating(true); // Kunci tombol saat sedang geser
    setIsTransitioning(true); // Nyalakan efek transisi
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    if (images.length <= 1 || isAnimating) return;
    setIsAnimating(true); // Kunci tombol saat sedang geser
    setIsTransitioning(true); // Nyalakan efek transisi
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  // Fungsi yang dijalankan otomatis SETELAH animasi geser selesai
  const handleTransitionEnd = () => {
    setIsAnimating(false); // Buka kunci, tombol bisa diklik lagi
    if (images.length <= 1) return;

    // Jika mencapai kloningan gambar pertama (berada di posisi paling kanan)
    if (currentIndex === images.length + 1) {
      setIsTransitioning(false); // Matikan animasi seketika
      setCurrentIndex(1); // Lompat tanpa animasi ke gambar pertama asli
    } 
    // Jika mencapai kloningan gambar terakhir (berada di posisi paling kiri atau index 0)
    else if (currentIndex === 0) {
      setIsTransitioning(false); // Matikan animasi seketika
      setCurrentIndex(images.length); // Lompat tanpa animasi ke gambar terakhir asli
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white text-2xl font-sans">
        Memuat Slideshow TV...
      </div>
    );
  }

  // Trik Kloning: [Gambar Terakhir] + [Semua Gambar Asli] + [Gambar Pertama]
  const extendedImages = [
    images[images.length - 1],
    ...images,
    images[0]
  ];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden group">
      
      {/* Wadah Panjang dengan Perhitungan Matematika Presisi */}
      <div 
        className="flex h-full"
        style={{ 
          // Lebar total wadah = jumlah gambar x 100%
          width: `${extendedImages.length * 100}%`,
          // Geser tepat sesuai porsi lebarnya
          transform: `translateX(-${currentIndex * (100 / extendedImages.length)}%)`,
          transition: isTransitioning ? "transform 1s ease-in-out" : "none" 
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedImages.map((img, index) => (
          <div 
            key={`${img.public_id}-${index}`} 
            className="h-full flex items-center justify-center flex-shrink-0"
            // Lebar setiap anak = 100% dibagi jumlah gambar
            style={{ width: `${100 / extendedImages.length}%` }}
          >
            <img 
              src={img.secure_url} 
              alt="Slideshow" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Tombol Kiri (Prev) */}
      <button 
        onClick={prevSlide} 
        className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40 p-3 rounded-full text-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Tombol Kanan (Next) */}
      <button 
        onClick={nextSlide} 
        className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40 p-3 rounded-full text-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Tombol Tengah (Play/Pause) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/60 p-6 rounded-full text-white cursor-pointer"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}