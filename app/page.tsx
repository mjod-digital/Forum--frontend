import Header from "./components/layout/Header/Header";
import HeroHome from "./sections/home/HeroHome/HeroHome";
import Place from "./sections/home/Place/Place";
import LocationNew from "./sections/home/LocationNew/LocationNew";
import Surroundings from "./sections/home/Surroundings/Surroundings";
import Lobby from "./sections/home/Lobby/Lobby";
import Footer from "./components/layout/Footer/Footer";
import Architecture from "./sections/home/Architecture/Architecture";
import Amenities from "./sections/home/Amenities/Amenities";
import Facing from "./sections/home/Facing/Facing";
import Improvement from "./sections/home/Improvement/Improvement";
import Older from "./sections/home/Older/Older";
import Apartments from "./sections/home/Apartments/Apartments";
import ReadySection from "./sections/home/Ready/ReadySection";
import Cookies from "./components/layout/Cookies/Cookies";
import Preloader from "./components/layout/Preloader/Preloader";

export const revalidate = 60;

export default async function Home() {
  const res = await fetch(`https://forum.mr-group.ru/api/index/`, {
    next: { revalidate: 60 }
  });
  const api = await res.json();

  return (
    <>
      {/* <Preloader /> */}
      <Header />
      <HeroHome 
      heroData={{
        background: api.firstBlockImage,
        backgroundMobile: api.firstBlockMobileImage,
        text: api.firstBlockText,
      }}
      />
      <Place placeData={{
        title: api.secondBlockTitle,
        paragraph: api.secondBlockText,
        images: api.secondBlockImages,
      }}/>
      <LocationNew 
        locationData={{
          title: api.mapTitle,
          paragraph: api.mapText, 
          locations: api.mapLocation
        }}
      />
      <Surroundings
         surroundingsData={{
           title: api.environmentTitle,
           slides: api.environmentSlider
         }}
      />
      <ReadySection />
      <Architecture 
        architectureData={{
          title: api.architectureTitle,
          slides: api.architectureSlider,
        }}/>
      <Improvement improvementData={{
        title: api.improvementsTitle,
        slides: api.improvementsSlider,
      }}/>
      <Lobby lobbyData={{
        title: api.lobbyTitle,
        slides: api.lobbySlider,
      }}/>
      <Amenities amenitiesData={{
        title: api.amenItiesTitle,
        slides: api.amenItiesSlider,
      }} />
      <Facing facingData={{
        title: api.finishingTitle,
        slides: api.finishingSlider,
      }} />
      <Older olderData={{
        title: api.placesolderTitle,
        slides: api.placesolderSlider,
      }}/>
      <Apartments apartmentsData={{
        title: api.chooseTitle,
        slides: api.chooseSlider,
      }}/>
      <Footer />
      <Cookies />
    </>
  );
  
}
