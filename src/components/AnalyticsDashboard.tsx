
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Clock, BookOpen, Target, TrendingUp, Flame, Brain, Star, Award, Lightbulb, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { User } from '../types';
import { calculateUserAnalytics, generateWeeklyProgress, generateSkillDistribution, calculateLearningInsights } from '../utils/analyticsCalculations';

interface AnalyticsDashboardProps {
  user: User;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ user }) => {
  const analytics = useMemo(() => calculateUserAnalytics(user), [user]);
  const weeklyProgress = useMemo(() => generateWeeklyProgress(user), [user]);
  const skillDistribution = useMemo(() => generateSkillDistribution(user), [user]);
  const insights = useMemo(() => calculateLearningInsights(analytics, user), [analytics, user]);

  const totalTime = weeklyProgress.reduce((sum, day) => sum + day.time, 0);
  const totalModulesThisWeek = weeklyProgress.reduce((sum, day) => sum + day.modules, 0);
  const averageSessionTime = totalModulesThisWeek > 0 ? Math.round(totalTime / totalModulesThisWeek) : 0;
  
  // Calculate progress percentage
  const totalModules = user.currentPath?.modules.length || 1;
  const progressPercentage = Math.round((user.completedModules.length / totalModules) * 100);

  // Generate trend data for the area chart
  const trendData = weeklyProgress.map((day, index) => ({
    ...day,
    cumulative: weeklyProgress.slice(0, index + 1).reduce((sum, d) => sum + d.modules, 0)
  }));

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-orange-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Learning Analytics</h1>
          <p className="text-gray-600 mt-1">Track your progress and insights for {user.track} track</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm px-3 py-1">
          {user.skillLevel} Level
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Learning Streak</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics.learningStreak} days</div>
            <p className="text-xs text-gray-500 mt-1">Keep the momentum going!</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Time</CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.totalTimeSpent}min</div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Modules Completed</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{user.completedModules.length}</div>
            <p className="text-xs text-gray-500 mt-1">of {totalModules} total</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
            <Target className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Brain className="h-5 w-5" />
              AI Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Weekly Learning Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                          <p className="font-medium">{label}</p>
                          <p className="text-green-600">Modules: {payload[0].value}</p>
                          <p className="text-blue-600">Time: {payload[1]?.value || 0} min</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="modules" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Trend */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Progress Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                          <p className="font-medium">{label}</p>
                          <p className="text-blue-600">Total Modules: {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#3b82f6" 
                  fill="#dbeafe" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Distribution */}
        {skillDistribution.length > 0 && (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Skill Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Performance Summary */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Session Time</span>
              <span className="font-semibold text-blue-600">{averageSessionTime} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Modules This Week</span>
              <span className="font-semibold text-green-600">{totalModulesThisWeek}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Learning Consistency</span>
              <Badge className="bg-orange-100 text-orange-700">
                {analytics.learningStreak >= 5 ? 'Excellent' : analytics.learningStreak >= 3 ? 'Good' : 'Building'}
              </Badge>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {totalModules - user.completedModules.length} modules remaining
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
