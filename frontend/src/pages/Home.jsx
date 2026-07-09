import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const loaderRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [artworks, setArtworks] = useState([]);

  cardsRef.current = [];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsLoaded(true),
      });

      tl.to(loaderRef.current, {
        opacity: 0,
        duration: 1,
        delay: 1.5,
        ease: "power2.out",
      });

      gsap.fromTo("nav",
        { y: -60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          delay: 2,
        }
      );

      gsap.fromTo(heroRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          delay: 2.2,
        }
      );

      cardsRef.current.slice(0, 3).forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.2,
            ease: "power3.out",
          }
        );
      });

      [3, 4].forEach((i) => {
        const card = cardsRef.current[i];
        if (!card) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });

        tl.fromTo(
          card.children[0],
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
        );

        tl.fromTo(
          card.children[1],
          { opacity: 0, x: i % 2 === 0 ? 50 : -50 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.3 }
        );
      });

      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 100 },
        {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          },
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
        }
      );
    });

    // Fetch artworks from backend
    fetch("/api/artworks/explore")
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data.slice(0, 6)); // Show top 6 featured artworks
      })
      .catch((err) => console.error("Failed to load featured artworks:", err));

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Track page visitor
    fetch('/api/track-visitor', { method: 'POST' })
      .catch(err => console.error('Error tracking visitor', err));
  }, []);

  return (
    <div className="relative">
      {!isLoaded && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-3xl font-bold"
        >
          Loading Musemarket...
        </div>
      )}

      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1577084381314-cae9920e6871?q=80&w=1704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <Navbar />

        <section
          ref={heroRef}
          className="flex flex-col items-center justify-center px-4 md:px-6 text-center pt-28 pb-20 md:pt-40 md:pb-28 backdrop-blur-sm text-white"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Discover & Own Timeless Art
          </h1>
          <p className="max-w-2xl text-lg md:text-xl mb-4">
            Find, fall in love with, and collect art from creative minds all
            from all the corners of the country.
          </p>
          <Link
            to="/explore"
            className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
          >
            Explore Gallery
          </Link>
        </section>

        <section className="bg-white px-6 py-20 text-black">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Artworks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {artworks.length > 0 ? (
              artworks.map((art, i) => {
                return(
                <div
                  key={art._id}
                  ref={(el) => (cardsRef.current[i] = el)}
                  className="rounded-lg overflow-hidden bg-white shadow-xl hover:shadow-2xl transition transform hover:scale-105"
                >
                  <img
                    src={encodeURI(art.imageUrl)}
                    alt={art.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold mb-2">{art.title}</h3>
                      {art.status === "Sold" && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Sold
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {art.description}
                    </p>
                    <p className="text-md font-semibold mt-2">
                      Rs. {art.price}
                    </p>
                  </div>
                </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No featured artworks available.
              </p>
            )}
          </div>

          {/* View All button */}
          <div className="flex justify-center mt-12">
            <Link
              to="/explore"
              className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
            >
              View All Artworks
            </Link>
          </div>
        </section>

        {/* rest of your page unchanged */}

        <section
          className="relative px-6 py-20 text-white min-h-[80vh]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1583119912267-cc97c911e416?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-0"></div>

          <div className="relative z-10 max-w-7xl mx-auto space-y-20">
            <h2 className="text-4xl font-bold text-center mb-12">
              Why Choose Us?
            </h2>

            <div
              ref={(el) => (cardsRef.current[3] = el)}
              className="flex flex-col md:flex-row items-center md:items-start gap-10"
            >
              <div className="md:w-1/2">
                <h3 className="text-3xl font-semibold mb-4">
                  Curated Art from Global Talents
                </h3>
                <p className="text-lg leading-loose">
                  Our platform carefully selects talented artists from around
                  the world, ensuring you discover unique and authentic artworks
                  that inspire.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="Curated Art"
                className="w-full md:w-[500px] max-h-[350px] object-cover rounded-lg shadow-lg"
              />
            </div>

            <div
              ref={(el) => (cardsRef.current[4] = el)}
              className="flex flex-col items-center md:items-start gap-10 md:flex-row-reverse"
            >
              <div className="md:w-1/2">
                <h3 className="text-3xl font-semibold mb-4">
                  Secure and Transparent Transactions
                </h3>
                <p className="text-lg leading-relaxed">
                  We prioritize your trust with seamless and secure payment
                  options, transparent pricing, and verified sellers, making art
                  collecting easy and reliable.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1578301996581-bf7caec556c0?q=80&w=400&auto=format&fit=crop"
                alt="Secure Transactions"
                className="w-full md:w-[500px] max-h-[350px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section
          ref={ctaRef}
          className="px-6 py-20 text-white text-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1577084381314-cae9920e6871?q=80&w=1704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        >
          <div className="backdrop-blur-sm bg-opacity-60 p-6 rounded-lg inline-block">
            <h2 className="text-4xl font-bold mb-6">Are You an Artist?</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Join our platform and showcase your talent to art lovers across
              the globe.
            </p>
            <Link
              to="signup"
              className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-300 transition"
            >
              Become a Seller 
            </Link>
          </div>
        </section>

        <footer className="bg-black text-white text-center p-6">
          &copy; {new Date().getFullYear()} Musemarket. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home;
