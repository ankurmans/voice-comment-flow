
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialCard } from "./TestimonialCard";

// Sample testimonial data
const testimonials = [
  {
    id: "1",
    name: "Jimmy Donaldson",
    username: "mrbeast",
    avatar: "https://placeholder.svg",
    comment: "Driply has been a game-changer for managing comments across all my channels!",
    platform: "youtube",
  },
  {
    id: "2",
    name: "Selena Gomez",
    username: "selenagomez",
    avatar: "https://placeholder.svg",
    comment: "With Driply, I can stay connected with fans without the endless scrolling.",
    platform: "instagram",
  },
  {
    id: "3",
    name: "Charlie D'Amelio",
    username: "charlidamelio",
    avatar: "https://placeholder.svg",
    comment: "My team and I love how Driply keeps our voice consistent across platforms.",
    platform: "tiktok",
  },
  {
    id: "4",
    name: "Mark Zuckerberg",
    username: "zuck",
    avatar: "https://placeholder.svg",
    comment: "Driply streamlines our community engagement and saves us hours every day.",
    platform: "facebook",
  },
  {
    id: "5",
    name: "Emma Chamberlain",
    username: "emmachamberlain",
    avatar: "https://placeholder.svg",
    comment: "Finally found a tool that actually sounds like me when responding to fans!",
    platform: "youtube",
  },
  {
    id: "6",
    name: "Addison Rae",
    username: "addisonrae",
    avatar: "https://placeholder.svg",
    comment: "Driply helps me maintain authentic connections with my audience at scale.",
    platform: "tiktok",
  },
  {
    id: "7",
    name: "David Dobrik",
    username: "daviddobrik",
    avatar: "https://placeholder.svg",
    comment: "My engagement has skyrocketed since using Driply. Totally worth it!",
    platform: "instagram",
  },
  {
    id: "8",
    name: "Zach King",
    username: "zachking",
    avatar: "https://placeholder.svg",
    comment: "The auto-replies are so good, my followers can't tell when it's Driply!",
    platform: "facebook",
  },
  {
    id: "9",
    name: "Liza Koshy",
    username: "lizakoshy",
    avatar: "https://placeholder.svg",
    comment: "Driply keeps my tone consistent across all my social platforms.",
    platform: "youtube",
  },
  {
    id: "10",
    name: "Kylie Jenner",
    username: "kyliejenner",
    avatar: "https://placeholder.svg",
    comment: "My team saves so much time with Driply's smart comment management.",
    platform: "instagram",
  },
  {
    id: "11",
    name: "Khaby Lame",
    username: "khaby00",
    avatar: "https://placeholder.svg",
    comment: "Simple, effective, and exactly what creators need for comment management.",
    platform: "tiktok",
  },
  {
    id: "12",
    name: "Casey Neistat",
    username: "caseyneistat",
    avatar: "https://placeholder.svg",
    comment: "Driply helps me stay connected with my audience without the burnout.",
    platform: "youtube",
  },
  {
    id: "13",
    name: "Bella Poarch",
    username: "bellapoarch",
    avatar: "https://placeholder.svg",
    comment: "Never miss important fan interactions thanks to Driply's smart filters.",
    platform: "tiktok",
  },
  {
    id: "14",
    name: "Logan Paul",
    username: "loganpaul",
    avatar: "https://placeholder.svg",
    comment: "The AI replies actually sound like me. My community loves the engagement!",
    platform: "youtube",
  },
  {
    id: "15",
    name: "James Charles",
    username: "jamescharles",
    avatar: "https://placeholder.svg",
    comment: "Driply understands my brand voice perfectly. So impressed!",
    platform: "instagram",
  },
  {
    id: "16",
    name: "Lilly Singh",
    username: "lilly",
    avatar: "https://placeholder.svg",
    comment: "Managing comments across platforms has never been this seamless.",
    platform: "facebook",
  },
] as const;

export const TestimonialCarousel = () => {
  return (
    <div className="w-full px-4 md:px-10">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
              <TestimonialCard
                name={testimonial.name}
                username={testimonial.username}
                avatar={testimonial.avatar}
                comment={testimonial.comment}
                platform={testimonial.platform}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 mx-2" />
          <CarouselNext className="static translate-y-0 mx-2" />
        </div>
      </Carousel>
    </div>
  );
};
