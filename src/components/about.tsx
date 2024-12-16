import Image from "next/image";
import ourMission from "@/images/our-mission.png";
import whyChoose from "@/images/why-choose.png";

const About = () => {
  return (
    <div className="container mx-auto px-12 py-16">
      <section className="text-center">
        <h2 className="text-4xl font-bold text-primary-6000 mb-4">About QAirline</h2>
        <p className="text-lg text-neutral-6000">
          At QAirline, we are dedicated to making your flight booking experience seamless, reliable, and enjoyable. Our
          mission is to connect you to your destinations with comfort and ease.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-4">Why Choose QAirline?</h3>
          <ul className="space-y-4 text-neutral-6000">
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">&bull;</span>
              <p>Effortless online booking process with our user-friendly platform.</p>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">&bull;</span>
              <p>Competitive prices and exclusive deals for our valued customers.</p>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">&bull;</span>
              <p>24/7 customer support to assist you every step of the way.</p>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">&bull;</span>
              <p>Extensive network connecting you to countless destinations worldwide.</p>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 font-bold">&bull;</span>
              <p>Flexible flight options to cater to your schedule and preferences.</p>
            </li>
          </ul>
        </div>

        <div>
          <Image src={whyChoose} alt="Why Choose QAirline" className="object-cover w-full" />
        </div>
      </section>

      <section className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-neutral-800 mb-4">Our Mission</h3>
        <p className="text-lg text-neutral-6000">
          To redefine travel by delivering an exceptional flight booking experience that combines technology,
          innovation, and human touch. We aim to set a new standard in the travel industry, ensuring every journey
          starts and ends with a smile.
        </p>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <Image
            src={ourMission}
            alt="Our Mission"
            className="object-cover w-full"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-4">Our Vision</h3>
          <p className="text-lg text-neutral-6000">
            At QAirline, we envision a world where travel is accessible, stress-free, and enriching. By leveraging
            cutting-edge technology and a customer-first approach, we strive to be the preferred choice for travelers
            worldwide.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
