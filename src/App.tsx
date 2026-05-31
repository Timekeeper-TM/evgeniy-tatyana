import { useState, useEffect,useRef } from 'react';
import { Music, Calendar, MapPin, Clock, Mic2, Heart, Send, ChevronDown, Users } from 'lucide-react';
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
  phone: string;
  attending: boolean;
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
        { value: timeLeft.days, label: 'Дни' },
        { value: timeLeft.hours, label: 'Часы' },
        { value: timeLeft.minutes, label: 'Минуты' },
        { value: timeLeft.seconds, label: 'Секунды' }
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
    { time: '16:30', event: 'Сбор гостей' },
    { time: '17:00', event: 'Церемония регистрации' },
    { time: '18:00', event: 'Банкет' },
    { time: '23:00', event: 'Завершение мероприятия' }
  ];
  // ...

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-serif">
        Программа дня
      </h3>
      <div className="flex flex-col items-center space-y-4">
        {schedule.map((item, idx) => (
          <div key={idx} className="text-center">
            <div className="text-2xl md:text-3xl font-light text-gray-900">
              {item.time}
            </div>
            <div className="text-lg text-gray-700 font-medium mb-2">
              {item.event}
            </div>
            {/* Рисуем вертикальную черточку, кроме последнего элемента */}
            {idx < schedule.length - 1 && (
              <div className="text-gray-300">|</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const RSVPSection = ({ onRSVPSubmit }: { onRSVPSubmit: () => void }) => {
  const [formData, setFormData] = useState<RSVPForm>({
    name: '',
    surname: '', // Здесь теперь фамилия
    attending: true,
    guest_count: 1,
    message: ''
  });

  // ... остальной код (handleSubmit и return)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvYbsR2zjgNRbV3u3WdnHm2t690BbsaOsY_x9gnrMeIYnVBsEghBAJ30MB4a40CsXL/exec';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setSubmitted(true);
      onRSVPSubmit();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при отправке. Попробуйте еще раз.');
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
        <h3 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Спасибо!</h3>
        <p className="text-gray-600 text-lg">
          Ваш ответ получен. Будем рады вас видеть!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-serif">
        Пожалуйста, заполните форму, чтобы мы могли учесть все детали и сделать праздник комфортным.
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="Введите ваше имя"
          />
        </div>
       
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Фамилия</label>
  <input
    type="text"
    value={formData.surname}
    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
    placeholder="Введите вашу фамилию"
  />
</div>

        <div className="flex gap-4">
          <label className="flex-1">
            <span className="block text-sm font-medium text-gray-700 mb-2">Придёте?</span>
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
                Да
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: false })}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  !formData.attending
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Нет
              </button>
            </div>
          </label>
        </div>

                <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Что будете пить?</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
            rows={3}
            placeholder="Водка, Вино, Пиво, Ром, Самогон, Шампанское, Ёрш, Северное сияние, АПСЕНТ?"
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
              Отправка...
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const VenueSection = ({ settings }: { settings: EventSettings | null }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="p-8 md:p-12">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-serif">
          Место проведения
        </h3>
        <p className="text-center text-lg text-gray-600 leading-relaxed mb-8">
          PORTCAFE, г. Пермь, ул. Нижнекамская 5а <br />
              </p>

        <div className="flex flex-col gap-3">
          <a
            href="https://yandex.ru/maps/-/CPHPZZ-2" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 hover:bg-amber-700 text-white text-center py-3 px-6 rounded-xl font-medium transition-all"
          >
            Открыть в Яндекс.Картах
          </a>
          <a
            href="https://go.2gis.com/8n4xH" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-900 text-white text-center py-3 px-6 rounded-xl font-medium transition-all"
          >
            Открыть в 2ГИС
          </a>
        </div>
      </div>
    </div>
  );
};
const PersonalInvite = () => {
  return (
    <section id="invite" className="py-20 px-4 bg-white"> {/* Вернули белый фон */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-gray-900 mb-6">Дорогие друзья!</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Это официальное приглашение на нашу свадьбу! 
          А получили вы его потому, что мы очень хотим видеть Вас в этот день рядом с нами!
        </p>
        
        <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img 
            src="/wedding-invitation/1.jpg" 
            alt="Наше фото" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};
const DressCodeSection = () => {
  return (
    <section id="dress-code" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-serif">
          Дресс-код
        </h3>
        <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
          Мы будем признательны, если вы поддержите цветовую гамму нашей свадьбы. 
          Будем рады видеть вас в нарядах данных оттенков:
        </p>
        
        {/* Фото цветовой гаммы: 6 штук, 3 ряда по 2 или 2 ряда по 3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="rounded-2xl overflow-hidden shadow-md">
              <img 
                src={`/wedding-invitation/color${num}.jpg`} 
                alt={`Цвет ${num}`} 
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const WeddingDaySchedule = () => {
  const schedule = [
    { time: '16:30', event: 'Сбор гостей' },
    { time: '17:00', event: 'Церемония регистрации' },
    { time: '18:00', event: 'Банкет' },
    { time: '23:00', event: 'Завершение мероприятия' }
  ];

  return (
    <section id="schedule" className="py-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
        {/* Часть с календарем */}
        <div className="text-center mb-10">
          <h3 className="text-4xl font-serif text-gray-800 mb-8 italic">Август 2026</h3>
          <div className="flex justify-center items-center gap-6 text-3xl font-light text-gray-600">
            <span>4</span> <span>5</span>
            <div className="relative flex items-center justify-center w-16 h-16">
              <Heart className="absolute w-16 h-16 text-red-400 fill-current" />
              <span className="relative z-10 text-white font-medium">6</span>
            </div>
            <span>7</span> <span>8</span>
          </div>
        </div>

        {/* Разделитель */}
        <div className="h-px bg-gray-100 w-full mb-10" />

        {/* Часть с программой */}
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-serif">
          Программа дня
        </h3>
        <div className="flex flex-col items-center space-y-4">
          {schedule.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-light text-gray-900">{item.time}</div>
              <div className="text-lg text-gray-700 font-medium mb-2">{item.event}</div>
              {idx < schedule.length - 1 && <div className="text-gray-300">|</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
  // 1. Сначала идет сам компонент плеера (всё его определение)
const FloatingMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <audio ref={audioRef} loop src={`${import.meta.env.BASE_URL}music.mp3`} />
      <button 
        onClick={toggleMusic} 
        className="bg-gray-900/60 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-gray-900/80 transition-all border border-white/20"
      >
        <Music className={`w-7 h-7 stroke-[2.5] ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-white'}`} />
      </button>
    </div>
  );
};

// 2. И только СРАЗУ ПОСЛЕ него начинается App
function App() {
    
  const [settings, setSettings] = useState<EventSettings | null>(null);

  useEffect(() => {
    setSettings(null); // Это заставит сайт всегда использовать ваш текст из кода
  }, []);
  const eventDate = settings?.event_date
  ? new Date(settings.event_date)
  : new Date('2026-08-06T16:30:00'); // Указали 6 августа, 16:30

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
      {/* Плеер вызывается один раз в начале главного контейнера */}
      <FloatingMusicPlayer />
      
      {/* Hero Section */}
      <header id="hero"
  className="relative min-h-screen flex flex-col justify-center items-center px-4 py-20"
  style={{
    // Убираем #0a0a0a, возвращаем нейтральный градиент
    backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%), url("/wedding-invitation/wedding-Photo.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: '50% 45%',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'multiply'
  }}
>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center mb-8">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 font-serif tracking-tight">
            {settings?.event_name || 'Евгений & Татьяна '}
          </h1>
          <h2 className="text-2xl md:text-3xl text-white/90 font-light tracking-wide mb-2">
  {settings?.main_artist_name || 'Приглашаем на нашу свадьбу!'}
</h2>
{/* Добавляем тот же стиль font-light и tracking-wide */}
<p className="text-2xl md:text-3xl text-white/90 font-light tracking-wide">
  06.08.2026
</p>
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          <CountdownTimer targetDate={eventDate} />

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => scrollToSection('rsvp')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Потвердите участие
            </button>
            <button
              onClick={() => scrollToSection('venue')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Проложить маршрут
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-8 text-white/60 text-sm uppercase tracking-wider flex flex-col items-center gap-2">
          <ChevronDown className="w-6 h-6 animate-bounce" />
          <span>Прокрутите</span>
        </div>
      </header>
      <PersonalInvite />
      {/* ВСТАВЬТЕ КАЛЕНДАРЬ СЮДА */}
        <WeddingDaySchedule />
           {/* Schedule Section */}
      <section id="schedule" className="py-20 md:py-32 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
    
        </div>
      </section>
<DressCodeSection />
      {/* RSVP Section */}
      <section id="rsvp" className="py-1 md:py-32 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
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
                  <p className="text-gray-400 text-sm mt-2">
            {settings?.event_name || 'Евгений & Татьяна 2026'} | Все права защищены (наверно)
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">
              Дом
            </button>
            <button onClick={() => scrollToSection('schedule')} className="hover:text-white transition-colors">
              Программа дня
            </button>
            <button onClick={() => scrollToSection('rsvp')} className="hover:text-white transition-colors">
              Форма
            </button>
            <button onClick={() => scrollToSection('venue')} className="hover:text-white transition-colors">
              Место проведения
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
