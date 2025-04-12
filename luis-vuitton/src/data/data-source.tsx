export enum Filters {
  DESC = "Descending",
  ASC = "Ascending",
  ALL = "Default",
}
export type Category = {
  id: number;
  name: string;
  img: string;
  slug: string;
  imgs: string[];
  desciptionTitle: string;
  desciptionDetail: string;
};
export type Item = {
  id: number;
  name: string;
  category: number;
  price: number;
  description: string;
  thumbnail: string;
  imgs: string[];
};
export const categories: Category[] = [
  {
    id: 1,
    name: "Women's Handbags",
    img: "/picture/categories/womoenHandbags.png",
    slug: "women-handbags",
    imgs: ["/picture/handBags/banner-1.png", "/picture/handBags/banner-2.png"],
    desciptionTitle: "Tote Bags",
    desciptionDetail: `Function meets form with Louis Vuitton’s sophisticated range of tote
            bags for Women. Crafted from the Maison’s signature materials, the
            versatile creations easily traverse the city and the beach.`,
  },
  {
    id: 2,
    name: "Women's Wallets and Small Leather Goods",
    img: "/picture/categories/womenWalletAndSmallLeatherGoods.png",
    slug: "women-wallet",
    imgs: ["/picture/wallet/banner-1.png", "/picture/wallet/banner-2.png"],
    desciptionTitle: "",
    desciptionDetail: "",
  },
  {
    id: 3,
    name: "Women's Fashion Jewelry",
    img: "/picture/categories/womenFashionJewelry.png",
    slug: "jewelry",
    imgs: ["/picture/jewelry/banner-1.png", "/picture/jewelry/banner-2.png"],
    desciptionTitle: "",
    desciptionDetail: "",
  },
  {
    id: 4,
    name: "Stationery",
    img: "/picture/categories/stationery.png",
    slug: "stationery",
    imgs: [
      "/picture/stationery/banner-1.png",
      "/picture/stationery/banner-2.png",
    ],
    desciptionTitle: "",
    desciptionDetail: "",
  },
  {
    id: 5,
    name: "Men's Bags",
    img: "/picture/categories/menBag.png",
    slug: "men-bags",
    imgs: ["/picture/menBags/banner-1.png", "/picture/menBags/banner-2.png"],
    desciptionTitle: "",
    desciptionDetail: "",
  },
  {
    id: 6,
    name: "Men's Accessories",
    img: "/picture/categories/menAccessories.png",
    slug: "men-accessories",
    imgs: [
      "/picture/menAccesory/banner-1.png",
      "/picture/menAccesory/banner-2.png",
    ],
    desciptionTitle: "",
    desciptionDetail: "",
  },
  {
    id: 7,
    name: "Perfumes",
    img: "/picture/categories/Perfumes.png",
    slug: "perfumes",
    imgs: ["/picture/perfumes/banner-1.png", "/picture/perfumes/banner-2.png"],
    desciptionTitle: "",
    desciptionDetail: "",
  },
  {
    id: 8,
    name: "Men's Shoes",
    img: "/picture/categories/menshoes.png",
    slug: "men-shoes",
    imgs: ["/picture/menShoes/banner-1.png", "/picture/menShoes/banner-2.png"],
    desciptionTitle: "",
    desciptionDetail: "",
  },
];

const handbags: Item[] = [
  {
    id: 1,
    name: "Neverfull Inside Out MM Br",
    category: 1,
    price: 10000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/1-1.png",
    imgs: ["/picture/handBags/1-1.png", "/picture/handBags/1-2.png"],
  },
  {
    id: 2,
    name: "Neverfull Inside Out MM Bl",
    category: 1,
    price: 10000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/2-1.png",
    imgs: ["/picture/handBags/2-1.png", "/picture/handBags/2-2.png"],
  },
  {
    id: 3,
    name: "Neverfull Bandoulière Inside Out BB Br",
    category: 1,
    price: 20000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/3-1.png",
    imgs: ["/picture/handBags/3-1.png", "/picture/handBags/3-2.png"],
  },
  {
    id: 4,
    name: "Neverfull Bandoulière Inside Out BB Bl",
    category: 1,
    price: 20000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/4-1.png",
    imgs: ["/picture/handBags/4-1.png", "/picture/handBags/4-2.png"],
  },
  {
    id: 5,
    name: "Neverfull Bandoulière Inside Out GM W",
    category: 1,
    price: 16000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/5-1.png",
    imgs: ["/picture/handBags/5-1.png", "/picture/handBags/5-2.png"],
  },
  {
    id: 6,
    name: "Neverfull Bandoulière Inside Out GM Y",
    category: 1,
    price: 15000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/6-1.png",
    imgs: ["/picture/handBags/6-1.png"],
  },
  {
    id: 7,
    name: "Neverfull Bandoulière Inside Out GM R",
    category: 1,
    price: 15000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/7-1.png",
    imgs: ["/picture/handBags/7-1.png"],
  },
  {
    id: 8,
    name: "Neverfull MM",
    category: 1,
    price: 13000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/8-1.png",
    imgs: ["/picture/handBags/8-1.png", "/picture/handBags/8-2.png"],
  },
  {
    id: 9,
    name: "Low Key Cabas MM BR",
    category: 1,
    price: 18000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/9-1.png",
    imgs: ["/picture/handBags/9-1.png"],
  },
  {
    id: 10,
    name: "Low Key Cabas MM BL",
    category: 1,
    price: 18000,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/handBags/10-1.png",
    imgs: ["/picture/handBags/10-1.png"],
  },
];

const wallets: Item[] = [
  {
    id: 11,
    name: "Lisa Wallet",
    category: 2,
    price: 1800,
    description: "New Reversible Neverfull",
    thumbnail: "/picture/wallet/11-1.png",
    imgs: ["/picture/wallet/11-1.png", "/picture/wallet/11-2.png"],
  },
  {
    id: 12,
    name: "Zippy Coin Purse",
    category: 2,
    price: 1300,
    description: "New Neverfull",
    thumbnail: "/picture/wallet/12-1.png",
    imgs: ["/picture/wallet/12-1.png"],
  },
  {
    id: 13,
    name: "Victorine Wallet",
    category: 2,
    price: 2300,
    description: "Flight Mode",
    thumbnail: "/picture/wallet/13-1.png",
    imgs: ["/picture/wallet/13-1.png", "/picture/wallet/13-2.png"],
  },
  {
    id: 14,
    name: "Victorine Wallet Br",
    category: 2,
    price: 2100,
    description: "",
    thumbnail: "/picture/wallet/14-1.png",
    imgs: ["/picture/wallet/14-1.png"],
  },
  {
    id: 15,
    name: "Cléa Wallet",
    category: 2,
    price: 2500,
    description: "Flight Mode",
    thumbnail: "/picture/wallet/15-1.png",
    imgs: ["/picture/wallet/15-1.png"],
  },
  {
    id: 16,
    name: "Rosalie Coin Purse",
    category: 2,
    price: 2100,
    description: "Flight Mode",
    thumbnail: "/picture/wallet/16-1.png",
    imgs: ["/picture/wallet/16-1.png"],
  },
];

const jewelrys: Item[] = [
  {
    id: 17,
    name: "LV Dazzle Necklace",
    category: 3,
    price: 5000,
    description: "",
    thumbnail: "/picture/jewelry/17-1.png",
    imgs: ["/picture/jewelry/17-1.png", "/picture/jewelry/17-2.png"],
  },
  {
    id: 18,
    name: "LV Dazzle Bracelet",
    category: 3,
    price: 4200,
    description: "",
    thumbnail: "/picture/jewelry/18-1.png",
    imgs: ["/picture/jewelry/18-1.png", "/picture/jewelry/18-2.png"],
  },
  {
    id: 19,
    name: "LV Dazzle Ring",
    category: 3,
    price: 9000,
    description: "Exclusive",
    thumbnail: "/picture/jewelry/19-1.png",
    imgs: ["/picture/jewelry/19-1.png", "/picture/jewelry/19-2.png"],
  },
  {
    id: 20,
    name: "LV Dazzle Earrings",
    category: 3,
    price: 6000,
    description: "",
    thumbnail: "/picture/jewelry/20-1.png",
    imgs: ["/picture/jewelry/20-1.png"],
  },
];

const stationeries: Item[] = [
  {
    id: 21,
    name: "Large Functional Weekly Agenda Refill 2025",
    category: 4,
    price: 500,
    description: "Commemorative",
    thumbnail: "/picture/stationery/21-1.png",
    imgs: ["/picture/stationery/21-1.png"],
  },
  {
    id: 22,
    name: "Jane Notebook MM B",
    category: 4,
    price: 800,
    description: "",
    thumbnail: "/picture/stationery/22-1.png",
    imgs: ["/picture/stationery/22-1.png"],
  },
  {
    id: 23,
    name: "Jane Notebook MM O",
    category: 4,
    price: 800,
    description: "",
    thumbnail: "/picture/stationery/23-1.png",
    imgs: ["/picture/stationery/23-1.png"],
  },
];

const menBags: Item[] = [
  {
    id: 24,
    name: "LV x Park Seo-Bo Alma Travel GM",
    category: 5,
    price: 2800,
    description: "",
    thumbnail: "/picture/menBags/24-1.png",
    imgs: ["/picture/menBags/24-1.png"],
  },
  {
    id: 25,
    name: "Messenger Voyager PM",
    category: 5,
    price: 1600,
    description: "",
    thumbnail: "/picture/menBags/25-1.png",
    imgs: ["/picture/menBags/25-1.png"],
  },
  {
    id: 26,
    name: "LV x Park Seo-Bo Keepall Bandoulière 25 L",
    category: 5,
    price: 2500,
    description: "",
    thumbnail: "/picture/menBags/26-1.png",
    imgs: ["/picture/menBags/26-1.png"],
  },
  {
    id: 27,
    name: "LV x Park Seo-Bo Keepall Bandoulière 25 R",
    category: 5,
    price: 2500,
    description: "",
    thumbnail: "/picture/menBags/27-1.png",
    imgs: ["/picture/menBags/27-1.png"],
  },
  {
    id: 28,
    name: "LV x Park Seo-Bo Christopher MM",
    category: 5,
    price: 1800,
    description: "",
    thumbnail: "/picture/menBags/28-1.png",
    imgs: ["/picture/menBags/28-1.png"],
  },
];

const menAccessories: Item[] = [
  {
    id: 29,
    name: "LV Gradient Bracelet G",
    category: 6,
    price: 1500,
    description: "",
    thumbnail: "/picture/menAccesory/29-1.png",
    imgs: ["/picture/menAccesory/29-1.png"],
  },
  {
    id: 30,
    name: "LV Gradient Bracelet B",
    category: 6,
    price: 1500,
    description: "",
    thumbnail: "/picture/menAccesory/30-1.png",
    imgs: ["/picture/menAccesory/30-1.png"],
  },
  {
    id: 31,
    name: "Epi Bracelet",
    category: 6,
    price: 2300,
    description: "",
    thumbnail: "/picture/menAccesory/31-1.png",
    imgs: ["/picture/menAccesory/31-1.png"],
  },
];

const perfumes: Item[] = [
  {
    id: 32,
    name: "Attrape-Rêves",
    category: 7,
    price: 5300,
    description: "Icon",
    thumbnail: "/picture/perfumes/32-1.png",
    imgs: ["/picture/perfumes/32-1.png"],
  },
  {
    id: 33,
    name: "Imagination",
    category: 7,
    price: 5000,
    description: "Icon",
    thumbnail: "/picture/perfumes/33-1.png",
    imgs: ["/picture/perfumes/33-1.png"],
  },
  {
    id: 34,
    name: "Ombre Nomade",
    category: 7,
    price: 3000,
    description: "Icon",
    thumbnail: "/picture/perfumes/34-1.png",
    imgs: ["/picture/perfumes/34-1.png"],
  },
  {
    id: 35,
    name: "L'Immensité",
    category: 7,
    price: 6000,
    description: "Icon",
    thumbnail: "/picture/perfumes/35-1.png",
    imgs: ["/picture/perfumes/35-1.png"],
  },
];

const menShoes: Item[] = [
  {
    id: 36,
    name: "LV x Park Seo-Bp LV Trainer Maxi Sneaker B",
    category: 8,
    price: 16000,
    description: "",
    thumbnail: "/picture/menShoes/36-1.png",
    imgs: ["/picture/menShoes/36-1.png"],
  },
  {
    id: 37,
    name: "LV x Park Seo-Bp LV Trainer Maxi Sneaker L",
    category: 8,
    price: 16000,
    description: "",
    thumbnail: "/picture/menShoes/37-1.png",
    imgs: ["/picture/menShoes/37-1.png"],
  },
  {
    id: 38,
    name: "LV Trainer Sneaker W",
    category: 8,
    price: 18000,
    description: "",
    thumbnail: "/picture/menShoes/38-1.png",
    imgs: ["/picture/menShoes/38-1.png"],
  },
  {
    id: 39,
    name: "LV Trainer Sneaker B",
    category: 8,
    price: 15000,
    description: "",
    thumbnail: "/picture/menShoes/39-1.png",
    imgs: ["/picture/menShoes/39-1.png"],
  },
  {
    id: 40,
    name: "LV Trainer Sneaker Y",
    category: 8,
    price: 16000,
    description: "",
    thumbnail: "/picture/menShoes/40-1.png",
    imgs: ["/picture/menShoes/40-1.png"],
  },
];
export const items: Item[] = [
  ...handbags,
  ...wallets,
  ...jewelrys,
  ...stationeries,
  ...menBags,
  ...menAccessories,
  ...perfumes,
  ...menShoes,
];
