import { ChatBubble } from "@/components/chat-bubble"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Mail } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const team = [
  {
    name: "Emmanuel Ebiendele",
    role: "Team Lead / Data Scientist & AI Engineer",
    bio: "Emmanuel leads the technical and strategic development of AfricareAI — from data pipeline design to AI model deployment and user experience optimization.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emmanuel-juw1XPTN5WGCcLtZxYkc6Mjg5QaTat.jpg",
    linkedin: "https://www.linkedin.com/in/emmanuel-ebiendele-063ba0255/",
    email: "emmydesign@gmail.com",
  },
  {
    name: "Akanji Motunrayo",
    role: "Meteorologist / Geospatial & Data Science Researcher",
    bio: "Motunrayo brings strong expertise in spatio-temporal data analysis and environmental-health linkages. She integrates climate and location-based data into AfricareAI's forecasting models to understand how weather and geography influence PHC disease patterns. Her background in meteorology and data analysis adds a new dimension to preventive health planning.",
    image: "/motunrayo-new.jpg",
    linkedin: "https://www.linkedin.com/in/akanji-motunrayo-5a4207227/",
    email: "motunrayoakanji1@gmail.com",
  },
  {
    name: "Olusola Adekunle Stephen",
    role: "Data Analyst / Health Informatics Specialist",
    bio: "Stephen works with the Ondo State Ministry of Health to analyze real-world PHC datasets, ensuring AfricareAI's models reflect actual field conditions. He is responsible for data cleaning, exploratory health analytics, and validation of disease trend models. His deep understanding of public health workflows bridges the gap between AI outputs and healthcare realities.",
    image: "/stephen-new.jpg",
    linkedin: "https://www.linkedin.com/in/olusola-adekunle-53815919a/",
    email: "olusolaadekunle7@gmail.com",
  },
]

export default function TeamPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Our Team</h1>
          <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            A diverse team of healthcare professionals, data scientists, and technologists united by a mission to
            transform Primary Health Care in Africa
          </p>
        </div>

        {/* Core Team */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-foreground">Leadership Team</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <div className="relative h-80 w-full bg-muted">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-contain" />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-1 text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                  <div className="flex gap-2">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={`mailto:${member.email}`}>
                      <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <ChatBubble />
    </div>
  )
}
