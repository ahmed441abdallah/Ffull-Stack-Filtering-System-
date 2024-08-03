"use client";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

import { ChevronDown } from "lucide-react"; 
import { useEffect, useState } from "react";
import axios from "axios";
import Products from "../components/ui/Products/Products";
import { QueryResult } from "@upstash/vector"; 
import { Product } from "../db"; 
import ProductSkeleton from "../components/ui/Products/ProductSkeleton ";
import { ProductState } from "../lib/validators/product-validator";
import { never } from "zod";
import { on } from "events";

export default function Home() {
  const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number]
  const SORT_OPTIONS = [
    { name: "None", value: "none" },
    { name: "Price: Low to High", value: "asc" },
    { name: "Price: High to Low", value: "desc" },
  ] as const;
  const SUBCATEGORIES = [
    { name: 'T-Shirts', selected: true, href: '#' },
    { name: 'Hoodies', selected: false, href: '#' },
    { name: 'Sweatshirts', selected: false, href: '#' },
    { name: 'Accessories', selected: false, href: '#' },
  ] as const;
  const COLOR_FILTERS = {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White' },
      { value: 'beige', label: 'Beige' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'purple', label: 'Purple' },
    ] as const,
  }


  const [filter, setFilter] = useState<ProductState>({
    color: ['beige', 'blue', 'green', 'purple', 'white'],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ['L', 'M', 'S'],
    sort: 'none',
  })
  const SIZE_FILTERS = {
    id: 'size',
    name: 'Size',
    options: [
      { value: 'S', label: 'S' },
      { value: 'M', label: 'M' },
      { value: 'L', label: 'L' },
    ],
  } as const
  
  const PRICE_FILTERS = {
    id: 'price',
    name: 'Price',
    options: [
      { value: [0, 100], label: 'Any price' },
      {
        value: [0, 20],
        label: 'Under 20€',
      },
      {
        value: [0, 40],
        label: 'Under 40€',
      },
      // custom option defined in JSX
    ],
  } as const
  

  const { data: products,refetch } = useQuery({
    queryKey: ["products", filter], // Include filter in queryKey to refetch when it changes
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<Product>[]>(
        "http://localhost:3000/api/products",
        {
         filter :{
          color: filter.color,
          size: filter.size,
          price: filter.price.range,
          sort: filter.sort,
         }
        }
      );
      return data;
    },
  });

  console.log(products);
  console.log(filter);
  const onSubmit = ()=> refetch();
  useEffect(() => {
onSubmit();
  },[filter])
  
  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, 'price' | 'sort'>
    value: string
  }) => {
    const isExisting = filter[category].includes(value as never) ;
    if (isExisting) {
      setFilter((prev) => ({ //remove the value from the category array
        ...prev,
        [category]: prev[category].filter((item) => item !== value),
      }));
    } else {
      setFilter((prev) => ({ // add the value to the category array
        ...prev,
        [category]: [...prev[category], value],
      }));
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          High-quality cotton selection 👕
        </h1>
        <div>
          
        </div>
      </div>
      <section className="pt-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8">
          <div className="col-span-1 hidden lg:block">
            <h1 className=" mb-2 font-bold text-xl text-gray-900 "> Categories 🔥</h1>
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
             {
              SUBCATEGORIES.map(  (subCategory) => ( <li key={subCategory.name}><button disabled={!subCategory.selected} className="disabled:opacity-60 disabled:cursor-not-allowed">{subCategory.name}</button> </li>))
             }

            </ul>
            { /*color filter component */}
            <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>  Size 🤏</AccordionTrigger>
    <AccordionContent>
      <ul>
        {
          SIZE_FILTERS.options.map((size,index) => (
            <li key={size.value} className="mb-2">
              <input
              checked={filter.size.includes(size.value)} 
              onChange={()=>{
                applyArrayFilter({category: 'size', value: size.value})
              }} type="checkbox" id={`size${index}`} className=" h-4 w-4 text-indigo-600 focus:ring-indigo-500"></input>
              <label className="text-gray-600  ml-3 text-sm" htmlFor={`size${index}`}> {size.label}</label>
            </li>
          ))
        }
      </ul>
    </AccordionContent>
  </AccordionItem>
</Accordion>
            <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>  Colors 🎨</AccordionTrigger>
    <AccordionContent>
      <ul>
        {
          COLOR_FILTERS.options.map((color,index) => (
            <li key={color.value} className="mb-2">
              <input
              checked={filter.color.includes(color.value)}
               onChange={()=>{
                applyArrayFilter({category: 'color', value: color.value})
              }} type="checkbox" id={`colors${index}`} className=" h-4 w-4 text-indigo-600 focus:ring-indigo-500"></input>
              <label className="text-gray-600  ml-3 text-sm" htmlFor={`colors${index}`}> {color.label}</label>
            </li>
          ))
        }
      </ul>
    </AccordionContent>
  </AccordionItem>
</Accordion>
            <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>  Price 💵</AccordionTrigger>
    <AccordionContent>
      <ul>
        {
          PRICE_FILTERS.options.map((price,index) => (
            <li key={index} className="mb-2">
              <input
              onChange={()=>{
                setFilter(prev =>{
                  return {
                    ...prev,
                    price: {
                      isCustom: false,
                      range: [...price.value]
                    }
                  }
                })
              }}
               type="checkbox" id={`price${index}`} className=" h-4 w-4 text-indigo-600 focus:ring-indigo-500"></input>
              <label className="text-gray-600  ml-3 text-sm" htmlFor={`price${index}`}> {price.label}</label>
            </li>
          ))
        }
      </ul>
    </AccordionContent>
  </AccordionItem>
</Accordion>

          </div>
          <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {
            products? products.map((product) => (
              <Products key={product.id} product={product.metadata!} />
            ))  : new Array(12).fill(null).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
            }
          </div>
        </div>
      </section>
    </main>
  );
}
