import { PageHero, Feature, MenuSection, img } from "../sections"

export default function Services() {
  return (
    <>
      <PageHero eyebrow="Services & Rituals"
        title={<>Crafted for the<br /><em className="font-normal italic">modern gentleman.</em></>}
        sub="Haircuts, the royal shave, skin, body and care — traditional technique met with modern craft."
        image="crown.jpg" />
      <Feature eyebrow="The Craft"
        title={<>Shaped to you,<br /><em className="font-normal italic">to the last detail.</em></>}
        body="A consultation first, then a cut and finish shaped to your face and your life. Beard sculpting, hot-oil treatments, and the quiet confidence of a precise line — with tools and products from the world's top houses."
        cta="Book a cut" image={img("craft.jpg")} service="Haircut" />
      <MenuSection />
    </>
  )
}
