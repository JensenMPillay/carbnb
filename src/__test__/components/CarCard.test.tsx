import { CarQuery } from "@/src/@types/queries.types";
import CarCard from "@/src/components/CarCard";
import { render, screen } from "../test-utils";

describe("CarCard", () => {
  const carMock = {
    id: "2187d1a8-f7bc-41b3-ba90-075fa464a746",
    category: "SUV",
    brand: "JAGUAR",
    model: "F-Pace",
    year: 2021,
    primaryColor: "ORANGE",
    trueColor: "atacama-orange-svo-ultra-metallic-gloss",
    transmission: "AUTOMATIC",
    fuelType: "ELECTRIC",
    imageUrl: [
      "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/0",
      "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/9",
      "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/22",
      "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/29",
    ],
    pricePerDay: 350,
    available: true,
    user: {
      id: "17ca0085-c6e2-4dcf-aff9-796ea448fc0c",
    },
    location: {
      id: "ChIJEQeEBwAT5kcRymwMi0k1Lgo",
      latitude: 48.9322127,
      longitude: 2.49489,
      address: "17, Rue du Onze Novembre",
      city: "Aulnay-sous-Bois",
      postalCode: "93600",
      state: "Seine-Saint-Denis",
      country: "France",
      formatted_address:
        "17 Rue du Onze Novembre, 93600 Aulnay-sous-Bois, France",
    },
    createdAt: new Date("2024-02-13T21:27:38.244Z"),
    updatedAt: new Date("2024-02-13T21:27:38.244Z"),
  } as CarQuery;

  it("renders", () => {
    render(<CarCard car={carMock} />);
  });

  it("displays car details correctly", () => {
    const {
      brand,
      category,
      model,
      year,
      transmission,
      fuelType,
      pricePerDay,
    } = carMock;

    render(<CarCard car={carMock} />);

    expect(screen.getByText(brand)).toBeInTheDocument();
    expect(screen.getByText(category)).toBeInTheDocument();
    expect(screen.getByText(model)).toBeInTheDocument();
    expect(screen.getByText(year)).toBeInTheDocument();
    expect(screen.getByText(transmission)).toBeInTheDocument();
    expect(screen.getByText(fuelType)).toBeInTheDocument();
    expect(screen.getByText(pricePerDay)).toBeInTheDocument();
    expect(screen.getByText("€")).toBeInTheDocument();
    expect(screen.getByText("/day")).toBeInTheDocument();
  });
});
