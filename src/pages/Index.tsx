
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FeatureCard } from "@/components/FeatureCard";
import { 
  Shield, 
  Navigation, 
  Smartphone, 
  User, 
  FileSymlink, 
  Activity,
  ChevronRight,
  Lock,
  ExternalLink,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const animationRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeFeature, setActiveFeature] = useState(0);

  // Feature carousel data
  const carouselFeatures = [
    {
      title: "Track IP Addresses",
      description: "Discover the geolocation, ISP, and network details of any IP address with our comprehensive tracker.",
      icon: <Navigation className="h-10 w-10 text-primary" />,
      link: "/ip-tracker"
    },
    {
      title: "Analyze Phone Numbers",
      description: "Verify and analyze phone numbers to identify carrier information, location, and potential risks.",
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      link: "/phone-tracker"
    },
    {
      title: "Search Usernames",
      description: "Find social media profiles associated with a username across multiple platforms.",
      icon: <User className="h-10 w-10 text-primary" />,
      link: "/username-tracker"
    },
    {
      title: "Secure File Sharing",
      description: "Share files with end-to-end encryption and password protection for enhanced privacy.",
      icon: <FileSymlink className="h-10 w-10 text-primary" />,
      link: "/file-sharing"
    },
    {
      title: "File Security Scanner",
      description: "Analyze files for potential security threats, malware, and hidden risks.",
      icon: <Activity className="h-10 w-10 text-primary" />,
      link: "/file-security"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % carouselFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselFeatures.length]);

  // Improved scroll reveal effect that doesn't make items disappear
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-enter");
          entry.target.classList.remove("opacity-0");
          // Once an element is visible, keep it visible by unobserving it
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el) => {
      observer.observe(el);
      animationRefs.current.push(el as HTMLElement);
    });

    return () => {
      animationRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="space-y-16 overflow-hidden">
      <section className="relative rounded-3xl overflow-hidden py-20 px-6 md:py-24 animate-on-scroll">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-600/20 via-cyber-500/10 to-cyber-400/5 animate-pulse-glow"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.15),transparent_40%)] animate-pulse"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(34,197,94,0.1),transparent_40%)] animate-pulse delay-700"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight gradient-text mb-6 leading-tight">
            Advanced OSINT &<br />Cybersecurity Suite
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Professional privacy-focused tools to gather intelligence, track online information, and securely share files.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="text-base gap-2 px-6 h-12 shadow-lg">
              <Link to="/ip-tracker">
                Start Investigation
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base gap-2 px-6 h-12 backdrop-blur-sm bg-background/80">
              <Link to="/file-sharing">
                Secure File Sharing
                <Lock className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature carousel */}
      <section className="py-12 animate-on-scroll">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold gradient-text">Explore Our Tools</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover what our cybersecurity suite can do for you
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto overflow-hidden py-10">
          <div className="flex justify-center gap-2 mb-8">
            {carouselFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeFeature ? "bg-primary scale-125" : "bg-muted"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="transition-all duration-500 ease-in-out">
            <Card className="mx-auto max-w-4xl overflow-hidden neo-morphism">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="bg-muted/30 p-10 flex items-center justify-center md:w-1/3">
                    <div className="text-primary p-6 rounded-full bg-primary/10 backdrop-blur-sm">
                      {carouselFeatures[activeFeature].icon}
                    </div>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <h3 className="text-2xl font-semibold mb-3">
                      {carouselFeatures[activeFeature].title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {carouselFeatures[activeFeature].description}
                    </p>
                    <Button asChild variant="outline">
                      <Link 
                        to={carouselFeatures[activeFeature].link} 
                        className="inline-flex items-center gap-2"
                      >
                        Try Now
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-12 animate-on-scroll">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold gradient-text">Cybersecurity Suite</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Our comprehensive set of tools to protect your online presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Navigation size={24} />}
            title="IP Address Tracker"
            description="Track the geolocation and network details of any IP address."
            href="/ip-tracker"
          />
          <FeatureCard
            icon={<Smartphone size={24} />}
            title="Phone Number Tracker"
            description="Verify and analyze phone numbers from around the world."
            href="/phone-tracker"
          />
          <FeatureCard
            icon={<User size={24} />}
            title="Username Tracker"
            description="Find social profiles associated with a username."
            href="/username-tracker"
          />
          <FeatureCard
            icon={<FileSymlink size={24} />}
            title="Secure File Sharing"
            description="Send files with end-to-end encryption and password protection."
            href="/file-sharing"
          />
          <FeatureCard
            icon={<Activity size={24} />}
            title="File Security Scanner"
            description="Check files for potential security threats and malware."
            href="/file-security"
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 animate-on-scroll bg-muted/20 rounded-3xl p-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold gradient-text">Real-World Applications</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            How professionals use our tools in the field
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="border-none shadow-lg overflow-hidden neo-morphism">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-cyber-600/20 to-cyber-400/10 p-6">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cybersecurity Analysts</h3>
                <p className="text-muted-foreground">
                  Use our IP tracking tools to investigate suspicious network activity and potential threats.
                </p>
              </div>
              <div className="p-6 bg-card">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Threat intelligence gathering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Network security monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Malware analysis and prevention</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg overflow-hidden neo-morphism">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-cyber-600/20 to-cyber-400/10 p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Security Researchers</h3>
                <p className="text-muted-foreground">
                  Leverage our file security tools to analyze suspicious files and potential threats.
                </p>
              </div>
              <div className="p-6 bg-card">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Zero-day vulnerability research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Secure code review and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Threat modeling and assessment</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-12 animate-on-scroll">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold gradient-text">Enterprise-Grade Security</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Powerful tools built with privacy and security in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 rounded-xl border bg-card hover:shadow-lg transition-all neo-morphism">
            <Shield className="h-14 w-14 mb-6 text-primary" />
            <h3 className="text-xl font-medium mb-4">Privacy-First Approach</h3>
            <p className="text-muted-foreground">
              We never store your data or tracking results. All processing happens on your device.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-xl border bg-card hover:shadow-lg transition-all neo-morphism">
            <Activity className="h-14 w-14 mb-6 text-primary" />
            <h3 className="text-xl font-medium mb-4">Real-Time Analysis</h3>
            <p className="text-muted-foreground">
              Get accurate, up-to-date information from trusted data sources around the world.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-xl border bg-card hover:shadow-lg transition-all neo-morphism">
            <FileSymlink className="h-14 w-14 mb-6 text-primary" />
            <h3 className="text-xl font-medium mb-4">Comprehensive Reports</h3>
            <p className="text-muted-foreground">
              Detailed analysis with all relevant information presented in an easy-to-understand format.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12 animate-on-scroll">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-cyber-600/10 to-cyber-400/10 p-12 rounded-2xl neo-morphism">
          <h2 className="text-3xl font-bold mb-6">Ready to enhance your cybersecurity?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start using our professional OSINT and security tools today to protect your digital presence.
          </p>
          <Button size="lg" className="text-base gap-2 px-8 h-12">
            <Link to="/ip-tracker">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
