import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import Footer from "../component/comman/footer"
import CourseSlider from "../component/core/Catalog/CourseSlider"
import Course_Card from "../component/core/Catalog/Course_Card"
import Error from "./Error"

import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/api"
import { getCatalogaPageData } from "../services/operations/pageAndComponentData"

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()

  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")

  // 🔹 Fetch all categories & match with URL
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const categoriesArray = res?.data?.data || []

        const selectedCategory = categoriesArray.find(
          (ct) =>
            ct.name
              .split(" ")
              .join("-")
              .toLowerCase() === catalogName?.toLowerCase()
        )

        if (!selectedCategory) {
          console.error("Category not found:", catalogName)
          return
        }

        setCategoryId(selectedCategory._id)
      } catch (error) {
        console.error("CATEGORY API ERROR:", error)
      }
    }

    getCategories()
  }, [catalogName])

  // 🔹 Fetch catalog page data
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogaPageData(categoryId)
        setCatalogPageData(res)
      } catch (error) {
        console.error("CATALOG PAGE ERROR:", error)
      }
    }

    if (categoryId) {
      getCategoryDetails()
    }
  }, [categoryId])

  // 🔹 Loading State
  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      {/* ================= HERO SECTION ================= */}
<div className="box-content bg-richblack-800 px-4 pt-24">
  <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
    <p className="text-sm text-richblack-300">
      Home / Catalog /{" "}
      <span className="text-yellow-25">
        {catalogPageData?.selectedCategory?.name}
      </span>
    </p>

    <p className="text-4xl font-bold text-richblack-5">
      {catalogPageData?.selectedCategory?.name}
    </p>

    <p className="max-w-[870px] text-richblack-200">
      {catalogPageData?.selectedCategory?.description}
    </p>
  </div>
</div>


      {/* ================= SECTION 1 ================= */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading  text-white text-4xl font-bold">Courses to get you started</div>

        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 cursor-pointer ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            }`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>

          <p
            className={`px-4 py-2 cursor-pointer ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            }`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>

        <CourseSlider
          Courses={catalogPageData?.selectedCategory?.courses}
        />
      </div>

      {/* ================= SECTION 2 ================= */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading text-white text-4xl font-bold">
          Top courses in{" "}
          {catalogPageData?.differentCategory?.name}
        </div>

        <div className="py-8">
          <CourseSlider
            Courses={catalogPageData?.differentCategory?.courses}
          />
        </div>
      </div>

      {/* ================= SECTION 3 ================= */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading  text-white text-4xl font-bold">Frequently Bought</div>

        <div className="py-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {catalogPageData?.mostSellingCourses
            ?.slice(0, 4)
            .map((course, index) => (
              <Course_Card
                key={index}
                course={course}
                Height="h-[400px]"
              />
            ))}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Catalog