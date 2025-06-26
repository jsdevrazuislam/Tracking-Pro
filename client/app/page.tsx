import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, Shield, MapPin, Star, Users, Clock, CheckCircle } from "lucide-react"
import LoginForm from "@/components/pages/login-form"
import SignupForm from "@/components/pages/signup-form"
import { Metadata } from "next"

export const metadata:Metadata = {
  title: 'CourierTrack Pro - Home',
  description: 'Streamline your delivery operations with real-time tracking, route optimization, and comprehensive management tools.'
}

const features = [
  {
    icon: Truck,
    title: "Real-time Tracking",
    description: "Track your parcels in real-time with live GPS updates and delivery notifications",
    color: "text-blue-600",
  },
  {
    icon: MapPin,
    title: "Smart Route Optimization",
    description: "AI-powered route optimization for faster deliveries and reduced costs",
    color: "text-green-600",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee",
    color: "text-purple-600",
  },
  {
    icon: Users,
    title: "Multi-role Management",
    description: "Comprehensive dashboards for customers, agents, and administrators",
    color: "text-orange-600",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support and real-time assistance",
    color: "text-red-600",
  },
  {
    icon: CheckCircle,
    title: "Delivery Guarantee",
    description: "On-time delivery guarantee with compensation for delays",
    color: "text-teal-600",
  },
]

const isLogin = false

const stats = [
  { label: "Parcels Delivered", value: "1M+", icon: Package },
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Cities Covered", value: "100+", icon: MapPin },
  { label: "Success Rate", value: "99.8%", icon: Star },
]

export default function LoginPage() {



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    CourierTrack Pro
                  </h1>
                </div>
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  Complete logistics management solution for modern courier services
                </p>
                <p className="text-lg text-gray-500">
                  Streamline your delivery operations with real-time tracking, route optimization, and comprehensive
                  management tools.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Auth Form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Get Started"}</CardTitle>
                  <CardDescription className="text-base">
                    {isLogin ? "Sign in to your account" : "Create your account today"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="login"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4">
                      <LoginForm />
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4">
                      <SignupForm />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CourierTrack Pro?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to streamline your logistics operations and enhance customer satisfaction.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${
                    feature.color === "text-blue-600"
                      ? "from-blue-50 to-blue-100"
                      : feature.color === "text-green-600"
                        ? "from-green-50 to-green-100"
                        : feature.color === "text-purple-600"
                          ? "from-purple-50 to-purple-100"
                          : feature.color === "text-orange-600"
                            ? "from-orange-50 to-orange-100"
                            : feature.color === "text-red-600"
                              ? "from-red-50 to-red-100"
                              : "from-teal-50 to-teal-100"
                  } mb-4`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
