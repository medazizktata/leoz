import Gallery from "../components/Gallery"
import { PageHero, Locations } from "../sections"

export default function Salon() {
  return (
    <>
      <PageHero eyebrow="The Salon"
        title={<>The house of <span className="gold-grad">Leoz</span>.</>}
        sub="Two homes in Dubai, a decade of craft, and a room built to make grooming a ritual worth the trip."
        image="lionsign.jpg" />
      <Gallery />
      <Locations />
    </>
  )
}
