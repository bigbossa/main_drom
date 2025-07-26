import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/providers/LanguageProvider";
import { Building, CheckCircle2, MapPin, Lock, WifiIcon, BellRing, CalendarDays, Users, Home, DoorOpen, ArrowUpCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, format, parseISO } from "date-fns"; 

type Announcement = {
  id: string;
  title: string;
  content: string;
  publish_date: string;
  important: boolean;
};

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [imageIndexes, setImageIndexes] = useState([0, 0, 0]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [stats, setStats] = useState({
    totalRooms: 9,
    availableRooms: 3,
    totalTenants: 6
  });

  const roomTypes = [
    {
      id: 1,
      images: [
        "https://i.ibb.co/gMBBxJp5/4.jpg",
      ],
    },
    {
      id: 2,
      images: [
        "https://i.ibb.co/nqLg8FsD/1.jpg",
      ],
    },
    {
      id: 3,
      images: [
        "https://i.ibb.co/HRsDfk0/5.jpg",
      ],
    },
  ];


useEffect(() => {
  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("publish_date", { ascending: false })
      .limit(10); // ดึงมาเยอะหน่อย แล้วค่อยกรองเอง

    if (!error && data) {
      const filtered = data.filter((announcement: Announcement) => {
        const days = differenceInDays(new Date(), new Date(announcement.publish_date));
        return days <= 7;
      });

      setAnnouncements(filtered as Announcement[]);
    }
  };

  fetchAnnouncements();
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) =>
        prev.map((idx, i) =>
          (idx + 1) % roomTypes[i].images.length
        )
      );
    }, 2500); // เปลี่ยนรูปทุก 2.5 วินาที

    return () => clearInterval(interval);
  }, [roomTypes]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("publish_date", { ascending: false })
        .limit(5); // แสดงแค่ 5 รายการล่าสุด

      if (!error && data) {
        setAnnouncements(data as Announcement[]);
      }
    };

    fetchAnnouncements();
  }, []);

  // Effect for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: WifiIcon,
      title: "Free Wi-Fi",
      titleTh: "Wi-Fi ฟรี",
      description: "High-speed internet in all rooms",
      descriptionTh: "อินเทอร์เน็ตความเร็วสูงในทุกห้อง",
    },
    {
      icon: Lock,
      title: "24/7 Security",
      titleTh: "ระบบรักษาความปลอดภัย 24 ชม.",
      description: "CCTV and keycard access system",
      descriptionTh: "ระบบ CCTV และคีย์การ์ด",
    },
    {
      icon: Building,
      title: "Modern Facilities",
      titleTh: "สิ่งอำนวยความสะดวกทันสมัย",
      description: "laundry, and common areas",
      descriptionTh: " ซักรีด และพื้นที่ส่วนกลาง",
    },
    {
      icon: MapPin,
      title: "Prime Location",
      titleTh: "ทำเลดี",
      description: "Close to universities and shopping centers",
      descriptionTh: "ใกล้มหาวิทยาลัยและห้างสรรพสินค้า",
    },
  ];
  const roomDetailsTitle = language === 'th' ? 'รายละเอียดห้องพัก' : 'Room Details';

  const statsCards = [
    {
      title: language === 'th' ? 'ห้องทั้งหมด' : 'Total Rooms',
      value: stats.totalRooms,
      icon: Home
    },
    {
      title: language === 'th' ? 'ห้องที่ว่าง' : 'Available Rooms',
      value: stats.availableRooms,
      icon: DoorOpen
    },
    {
      title: language === 'th' ? 'ผู้เช่าทั้งหมด' : 'Total Tenants',
      value: stats.totalTenants,
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary">
                  {t("app.title")}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <Link to="/login">
                <Button variant="default">{t("auth.login")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 z-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
              {t("welcome.title")}
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
              {t("welcome.subtitle")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">{t("welcome.login")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-8 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {t("welcome.features")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-lg shadow-sm border border-border flex flex-col items-center text-center"
              >
                <div className="inline-flex items-center justify-center rounded-md p-2 bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">
                  {language === "en" ? feature.title : feature.titleTh}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {language === "en"
                    ? feature.description
                    : feature.descriptionTh}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>      <div style={{ backgroundColor: '#fb8c00' }} className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">{roomDetailsTitle}</h2>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {<stat.icon className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Available Rooms */}
      <div className="py-8 sm:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {t("welcome.explore")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map((room) => (
              <div
                key={room.id}
                className="bg-card rounded-lg overflow-hidden shadow-md border border-border flex flex-col"
              >
                <div className="w-full h-[400px] overflow-hidden cursor-pointer" onClick={() => setModalImage(room.images[0])}>
                  <img
                    src={room.images[0]}
                    alt={`Room ${room.id}`}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal รูปภาพ */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Room Large"
            className="w-full max-w-[90vw] max-h-[80vh] sm:max-w-[600px] md:max-w-[800px] h-auto rounded-lg shadow-lg border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Calendar Section */}
      <div className="py-8 sm:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground 
              bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70
              animate-fade-in">
              {t("calendar.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("calendar.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4 sm:p-6
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 transform scale-110 transition-transform",
                  day_today: "bg-accent text-accent-foreground font-bold ring-2 ring-primary ring-offset-2",
                  cell: "text-center p-0 relative [&:has([aria-selected])]:bg-primary/10 rounded-md transition-colors",
                  day: "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 p-0 font-normal hover:bg-muted rounded-md transition-all hover:scale-105 active:scale-95",
                  head_cell: "text-muted-foreground rounded-md w-12 sm:w-14 md:w-16 lg:w-20 font-semibold text-sm sm:text-base uppercase",
                  nav_button: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 bg-muted/50 hover:bg-primary/10 rounded-full transition-colors",
                  table: "w-full border-collapse space-y-4"
                }}
              />
            </div>

            {/* Announcements Section */}
            <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4 sm:p-6
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <BellRing className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  {t("announcements.title")}
                </h3>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
               {announcements.length > 0 ? (
                announcements
                  .slice(0, 7) 
                  .map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-4 bg-muted/50 rounded-lg border border-border/50
                        hover:bg-muted/70 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {announcement.title}
                          </h4>
                          {announcement.important && (
                            <Badge variant="destructive" className="ml-2">
                              {t("announcements.important")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {format(parseISO(announcement.publish_date), "d MMMM yyyy")}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {announcement.content}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <BellRing className="mx-auto h-12 w-12 mb-3 text-muted-foreground" />
                  <p>{t("announcements.noAvailable")}</p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <div
          className="fixed bottom-4 right-4 z-50"
          onClick={scrollToTop}
        >
          <Button className="rounded-full p-3 bg-primary text-primary-foreground shadow-md
            transition-all duration-300 hover:scale-110 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-background text-foreground border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold mb-4">{t("app.title")}</h3>
              <div className="w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d123948.80735360993!2d99.8125109!3d13.8750008!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2e592573eac1f%3A0xc0b0318b7fb3fd64!2z4Lia4LmJ4Liy4LiZ4Lie4Li44LiX4LiY4LiK4Liy4LiV4Li0IOC4meC4hOC4o-C4m-C4kOC4oQ!5e0!3m2!1sth!2sth!4v1748183614363!5m2!1sth!2sth"
                  className="w-full"
                  height="150"
                  style={{ border: "2px solid #dfdfdf", borderRadius: "18px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>
            </div>
            <div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="flex space-x-4">
                <a href="https://maps.app.goo.gl/SUTe631uLxX4DD3QA" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
                  <p className="text-muted-foreground">100 หนองปากโลง</p>
                  <p className="text-muted-foreground">อำเภอเมืองนครปฐม นครปฐม 73000</p>
                  <p className="text-muted-foreground">Phone: 06-5329-9452</p>
                  <p className="text-muted-foreground">Line : IDLine</p>
                  <p className="text-muted-foreground"><a href="https://www.facebook.com/poll.ponlop.5/">Facebook : Poll Ponlop</a></p>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {t("app.title")}. {t("footer.rights")}.
            </p>
          </div>
        </div>      </footer>      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{ backgroundColor: '#FF6600' }}
          className="fixed bottom-8 right-8 text-white p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none z-50"
          aria-label="Back to top"
        >
          <ArrowUpCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
