import { connect } from "@/dbConnection/dbConnection"
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from "@/helpers/getDataFromToken"

connect()

export async function POST(request: NextRequest) {
    try {
        // Extract user ID from token
        const userId = await getDataFromToken(request)

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
        }

        // Fetch user data, excluding password
        const user = await User.findOne({ _id: userId }).select("-password")

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Success
        return NextResponse.json({
            message: "User found",
            data: user
        })

    } catch (error: any) {
        console.error("Error fetching user:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
