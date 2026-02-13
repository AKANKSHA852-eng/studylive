import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { catalogData } from "../api"

export const getCatalogaPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = null

  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId }
    )

    if (!response?.data?.success) {
      throw new Error("Could not Fetch Category page data")
    }

    // ✅ ONLY DATA RETURN
    result = response.data.data
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR:", error)
    toast.error(error.message)
    result = null
  }

  toast.dismiss(toastId)
  return result
}

