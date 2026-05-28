import { useState, useEffect } from 'react';
import { Music, Calendar, MapPin, Clock, Mic2, Heart, Send, ChevronDown, Users } from 'lucide-react';
import { supabase } from './lib/supabase';

interface EventSettings {
  event_name: string;
  event_date: string;
  venue_name: string;
  venue_address: string;
  venue_map_url: string;
  main_artist_name: string;
  main_artist_image: string;
  main_artist_bio: string;
}

interface RSVPForm {
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  guest_count: number;
  message: string;
}

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 md:gap-8 mb-12">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' }
      ].map((item, idx) => (
        <div key={idx} className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 min-w-[80px] md:min-w-[110px] transition-transform hover:scale-105">
            <div className="text-4xl md:text-6xl font-bold text-gray-900 font-serif">
              {String(item.value).padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs md:text-sm text-white/80 mt-2 uppercase tracking-wider">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const EventSchedule = () => {
  const schedule = [
    { time: '18:00', event: 'Doors Open', icon: '🚪' },
    { time: '19:00', event: 'Opening Act', icon: '🎸' },
    { time: '20:30', event: 'Main Performance', icon: '🎤' },
    { time: '22:30', event: 'Encore', icon: '✨' },
    { time: '23:00', event: 'After Party', icon: '🎉' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-serif">
        Event Schedule
      </h3>
      <div className="space-y-6">
        {schedule.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 group">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 min-w-[100px] font-serif">
              {item.time}
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-400 to-transparent relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 shadow-md transition-transform group-hover:scale-125"></div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-6 py-3 shadow-sm min-w-[200px]">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-gray-800">{item.event}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RSVPSection = ({ onRSVPSubmit }: { onRSVPSubmit: () => void }) => {
  const [formData, setFormData] = useState<RSVPForm>({
    name: '',
    email: '',
    phone: '',
    attending: true,
    guest_count: 1,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('guests').insert([formData]);
      if (error) throw error;

      setSubmitted(true);
      onRSVPSubmit();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-green-600" fill="currentColor" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Thank You!</h3>
        <p className="text-gray-600 text-lg">
          Your RSVP has been received. We look forward to seeing you!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-serif">
        RSVP
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex-1">
            <span className="block text-sm font-medium text-gray-700 mb-2">Attending?</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: true })}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  formData.attending
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: false, guest_count: 1 })}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  !formData.attending
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No
              </button>
            </div>
          </label>
        </div>

        {formData.attending && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <select
              value={formData.guest_count}
              onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
            rows={3}
            placeholder="Looking forward to it!"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send RSVP
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const VenueSection = ({ settings }: { settings: EventSettings | null }) => {
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0-QbyHqYpTBYLZPsFX3GgXqPnDgJqA&q=${encodeURIComponent(settings?.venue_address || '')}`;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="p-8 md:p-12">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-serif">
          Venue
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 mb-8 md:mb-0 md:pr-8">
            <div className="flex items-center gap-3 mb-4 text-gray-600">
              <MapPin className="w-6 h-6 text-amber-500" />
              <h4 className="text-2xl font-bold text-gray-900 font-serif">
                {settings?.venue_name || 'Crystal Arena'}
              </h4>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              {settings?.venue_address || '45 Harmony Boulevard, Music City, MC 12345'}
            </p>
          </div>
          <div className="flex-none">
            <a
              href={settings?.venue_map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.venue_address || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
            >
              <MapPin className="w-5 h-5" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
      <div className="relative h-80 bg-gray-200">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
          title="Venue Map"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

function App() {
  const [settings, setSettings] = useState<EventSettings | null>(null);

  useEffect(() => {
    setSettings(null); // Это заставит сайт всегда использовать ваш текст из кода
  }, []);
  const eventDate = settings?.event_date
    ? new Date(settings.event_date)
    : new Date('2026-08-15T19:00:00Z');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRSVPSubmit = () => {
    setTimeout(() => {
      const venueSection = document.getElementById('venue');
      venueSection?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <header
        id="hero"
        className="relative min-h-screen flex flex-col justify-center items-center px-4 py-20"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%), url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center mb-8">
          <Music className="w-16 h-16 md:w-20 md:h-20 text-amber-400 mx-auto mb-8 animate-pulse" />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 font-serif tracking-tight">
            {settings?.event_name || 'Евгений & Татьяна '}
          </h1>
          <h2 className="text-2xl md:text-3xl text-white/90 font-light tracking-wide">
          {settings?.main_artist_name || 'Приглашаем на нашу свадьбу!'}
          </h2>
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          <CountdownTimer targetDate={eventDate} />

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => scrollToSection('rsvp')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              RSVP Now
            </button>
            <button
              onClick={() => scrollToSection('venue')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Get Directions
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-8 text-white/60 text-sm uppercase tracking-wider flex flex-col items-center gap-2">
          <ChevronDown className="w-6 h-6 animate-bounce" />
          <span>Scroll to explore</span>
        </div>
      </header>

      {/* Event Info */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-lg">
              <Calendar className="w-12 h-12 text-amber-600 mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-serif">Date & Time</h3>
              <p className="text-xl font-bold text-gray-900 mb-4 font-serif">{formatDate(eventDate)}</p>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Doors at 6:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700 mt-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Show starts at {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 shadow-lg">
              <Mic2 className="w-12 h-12 text-gray-700 mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-serif">Featured Artist</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4 font-serif">{settings?.main_artist_name || 'The Midnight Echo'}</p>
              <p className="text-gray-600 leading-relaxed">
                {settings?.main_artist_bio || 'An award-winning electronic music duo known for their mesmerizing live performances and chart-topping hits.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 md:py-32 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <EventSchedule />
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 md:py-32 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-2xl mx-auto">
          <RSVPSection onRSVPSubmit={handleRSVPSubmit} />
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-20 md:py-32 px-4 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="max-w-5xl mx-auto">
          <VenueSection settings={settings} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="text-center">
          <Music className="w-8 h-8 text-amber-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400 text-sm">
            {settings?.event_name || 'Евгений & Татьяна 2026'} | All rights reserved
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('schedule')} className="hover:text-white transition-colors">
              Schedule
            </button>
            <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors">
              RSVP
            </button>
            <button onClick={() => scrollToSection('venue')} className="hover:text-white transition-colors">
              Venue
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
