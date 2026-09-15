import logo from "./logo.svg";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import leaf_icon from "./leaf_icon.svg";
import coin_icon from "./coin_icon.svg";
import box_icon from "./box_icon.svg";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";
import main_banner_bg from "./main_banner_bg.webp";
import main_banner_bg_sm from "./main_banner_bg_sm.webp";
import bottom_banner_image from "./bottom_banner_image.webp";
import bottom_banner_image_sm from "./bottom_banner_image_sm.webp";
import add_address_iamge from "./add_address_image.svg";
import organic_vegitable_image from "./organic_vegitable_image.png";
import fresh_fruits_image from "./fresh_fruits_image.png";
import tubers_image from "./tubers_image.webp";
import legumes_image from "./legumes_image.webp";
import livestock_image from "./livestock_image.webp";
import spices_image from "./spices_image.webp";
import grain_image from "./grain_image.png";


export const assets = {
  logo,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  main_banner_bg,
  main_banner_bg_sm,
  bottom_banner_image,
  bottom_banner_image_sm,
  add_address_iamge,
  box_icon,
};

export const categories = [
  {
    text: "Vegetables",
    path: "Vegetables",
    image: organic_vegitable_image,
    bgColor: "#F0F5DE",
  },
  {
    text: "Fruits",
    path: "Fruits",
    image: fresh_fruits_image,
    bgColor: "#FEE6CD",
  },
  {
    text: "Grains & Cereals",
    path: "Grains",
    image: grain_image,
    bgColor: "#F1E3F9",
  },
  {
    text: "Tubers & Roots",
    path: "Tubers",
    image: tubers_image,
    bgColor: "#FBE9D0",
  },
  {
    text: "Legumes & Nuts",
    path: "Legumes",
    image: legumes_image,
    bgColor: "#E8F0E0",
  },
  {
    text: "Poultry & Livestock",
    path: "Livestock",
    image: livestock_image,
    bgColor: "#F4E4E4",
  },
  {
    text: "Spices & Herbs",
    path: "Spices",
    image: spices_image,
    bgColor: "#EFE6F5",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "Best Sellers", url: "#" },
      { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Delivery you can track",
    description: "Produce ships within days of harvest, not weeks.",
  },
  {
    icon: leaf_icon,
    title: "Straight from the farm",
    description: "No resellers, no markups — buy directly from the grower.",
  },
  {
    icon: coin_icon,
    title: "Fair prices, both ways",
    description: "Farmers set their own prices. You skip the middleman markup.",
  },
  {
    icon: trust_icon,
    title: "Verified farmers only",
    description: "Every seller on FarmerCart is a registered producer.",
  },
];


