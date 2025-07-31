import Header from "@/components/layout/header";
import { Lightbulb, Target, TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";

export default function Suggestions() {
  const personalizedSuggestions = [
    {
      priority: "high",
      title: "Reduce Lunch Food Waste",
      description: "Your class discards 30% more food than the school average during lunch breaks.",
      impact: "Potential reduction: 8kg CO₂/week",
      actions: [
        "Take smaller portions initially",
        "Use the 'taste before waste' rule",
        "Share unwanted food with classmates",
        "Report portion sizes to canteen staff"
      ],
      icon: "🍽️",
    },
    {
      priority: "medium",
      title: "Improve Plastic Segregation",
      description: "Current accuracy: 85%. School target: 95%",
      impact: "Potential gain: +50 green points/day",
      actions: [
        "Learn plastic recycling symbols",
        "Clean containers before disposal",
        "Use designated plastic bins only",
        "Organize peer education sessions"
      ],
      icon: "♻️",
    },
    {
      priority: "medium",
      title: "Digital-First Approach",
      description: "Your grade uses 40% more paper than necessary for assignments.",
      impact: "Save: 200 sheets/week",
      actions: [
        "Use tablets/phones for note-taking",
        "Submit assignments digitally",
        "Print double-sided when necessary",
        "Reuse scrap paper for rough work"
      ],
      icon: "📱",
    },
    {
      priority: "low",
      title: "Water Conservation",
      description: "Implement sensor-based taps to reduce wastage by 40%.",
      impact: "Save: 200L/day",
      actions: [
        "Report leaky taps immediately",
        "Use water bottles efficiently",
        "Promote shorter handwashing",
        "Install water-saving devices"
      ],
      icon: "💧",
    },
  ];

  const classCompetitions = [
    {
      title: "Zero Waste Week Challenge",
      description: "Compete with other classes to generate the least waste for one week",
      reward: "500 bonus green points + school recognition",
      duration: "7 days",
    },
    {
      title: "Perfect Segregation Month",
      description: "Achieve 100% waste segregation accuracy for 30 days",
      reward: "Class movie screening + pizza party",
      duration: "30 days",
    },
    {
      title: "Green Innovation Project",
      description: "Create a waste reduction solution for your school",
      reward: "1000 green points + implementation funding",
      duration: "2 months",
    },
  ];

  const quickWins = [
    "Use reusable water bottles instead of buying plastic ones",
    "Bring lunch in reusable containers",
    "Use digital notes apps instead of paper notebooks",
    "Set up a classroom composting bin for organic waste",
    "Create 'waste monitors' rotation among classmates",
    "Start a 'repair café' for broken school supplies",
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "medium":
        return <Target className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Personalized Suggestions"
        subtitle="Smart recommendations to improve your environmental impact"
      />
      
      <div className="p-6">
        
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">Based on Your Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {personalizedSuggestions.map((suggestion, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-sm p-6 border-2 ${getPriorityColor(suggestion.priority)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getPriorityIcon(suggestion.priority)}
                        <span className="text-sm text-gray-600 capitalize">{suggestion.priority} Priority</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-blue-800">{suggestion.impact}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-800">Action Steps:</h4>
                  <ul className="space-y-1">
                    {suggestion.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>



        
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Quick Wins</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-gray-600 mb-4">Simple changes you can implement immediately:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickWins.map((win, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{win}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Track Your Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600 mb-1">0</p>
              <p className="text-sm text-gray-600">Suggestions completed</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 mb-1">0</p>
              <p className="text-sm text-gray-600">Active challenges</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600 mb-1">0</p>
              <p className="text-sm text-gray-600">Points earned from improvements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
