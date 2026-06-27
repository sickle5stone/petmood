import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CaptureScreen from './screens/CaptureScreen'
import AnalyzingScreen from './screens/AnalyzingScreen'
import ResultScreen from './screens/ResultScreen'
import HistoryScreen from './screens/HistoryScreen'
import DailyDashboardScreen from './screens/DailyDashboardScreen'
import MoodInsightsScreen from './screens/MoodInsightsScreen'
import WeeklyInsightsScreen from './screens/WeeklyInsightsScreen'
import CareLogScreen from './screens/CareLogScreen'
import PetPassportScreen from './screens/PetPassportScreen'
import MoreScreen from './screens/MoreScreen'
import HealthLogScreen from './screens/HealthLogScreen'
import PharmacyLogScreen from './screens/PharmacyLogScreen'
import EmergencyVaultScreen from './screens/EmergencyVaultScreen'
import VetSummaryScreen from './screens/VetSummaryScreen'
import LitterLogScreen from './screens/LitterLogScreen'
import NutritionLabScreen from './screens/NutritionLabScreen'
import PlayLabScreen from './screens/PlayLabScreen'
import TrainingLogScreen from './screens/TrainingLogScreen'
import BondLogScreen from './screens/BondLogScreen'
import CleaningLogScreen from './screens/CleaningLogScreen'
import SitterModeScreen from './screens/SitterModeScreen'
import EnvironmentAuditScreen from './screens/EnvironmentAuditScreen'
import GalleryScreen from './screens/GalleryScreen'
import BehaviorLabScreen from './screens/BehaviorLabScreen'
import PersonalityCompassScreen from './screens/PersonalityCompassScreen'
import LifeStageScreen from './screens/LifeStageScreen'
import OutdoorConfidenceScreen from './screens/OutdoorConfidenceScreen'
import LeashGuideScreen from './screens/LeashGuideScreen'
import HumanInjuryLogScreen from './screens/HumanInjuryLogScreen'
import AICompanionScreen from './screens/AICompanionScreen'
import BottomNav from './components/BottomNav'
import { getCats, addCat } from './dataService'
import { seedMockData } from './mockSeed'

export default function App() {
  const [cats, setCats] = useState([])

  useEffect(() => {
    seedMockData()
    getCats()
      .then(setCats)
      .catch(() => {})
  }, [])

  async function handleAddCat(name) {
    try {
      const id = await addCat(name)
      setCats((prev) => [...prev, { id, name, emoji: '🐱' }])
    } catch {
      setCats((prev) => [...prev, { id: `local_${Date.now()}`, name, emoji: '🐱' }])
    }
  }

  const sharedProps = { cats }

  return (
    <BrowserRouter>
      <div className="mx-auto max-w-sm min-h-svh relative pm-shell">
        <Routes>
          {/* Core flow */}
          <Route path="/" element={<CaptureScreen cats={cats} onAddCat={handleAddCat} />} />
          <Route path="/analyzing" element={<AnalyzingScreen />} />
          <Route path="/result" element={<ResultScreen />} />

          {/* Primary nav */}
          <Route path="/dashboard" element={<DailyDashboardScreen {...sharedProps} />} />
          <Route path="/history/:catId" element={<HistoryScreen {...sharedProps} />} />
          <Route path="/insights/:catId" element={<MoodInsightsScreen {...sharedProps} />} />
          <Route path="/weekly/:catId" element={<WeeklyInsightsScreen {...sharedProps} />} />
          <Route path="/care/:catId" element={<CareLogScreen {...sharedProps} />} />
          <Route path="/passport/:catId" element={<PetPassportScreen {...sharedProps} />} />

          {/* More hub */}
          <Route path="/more/:catId" element={<MoreScreen {...sharedProps} />} />

          {/* Health & Medical */}
          <Route path="/health/:catId" element={<HealthLogScreen {...sharedProps} />} />
          <Route path="/pharmacy/:catId" element={<PharmacyLogScreen {...sharedProps} />} />
          <Route path="/vet-summary/:catId" element={<VetSummaryScreen {...sharedProps} />} />
          <Route path="/emergency/:catId" element={<EmergencyVaultScreen {...sharedProps} />} />

          {/* Nutrition & Digestion */}
          <Route path="/nutrition/:catId" element={<NutritionLabScreen {...sharedProps} />} />
          <Route path="/litter/:catId" element={<LitterLogScreen {...sharedProps} />} />

          {/* Behaviour & Training */}
          <Route path="/training/:catId" element={<TrainingLogScreen {...sharedProps} />} />
          <Route path="/bond/:catId" element={<BondLogScreen {...sharedProps} />} />
          <Route path="/behavior/:catId" element={<BehaviorLabScreen {...sharedProps} />} />
          <Route path="/personality/:catId" element={<PersonalityCompassScreen {...sharedProps} />} />
          <Route path="/leash/:catId" element={<LeashGuideScreen {...sharedProps} />} />

          {/* Activity & Play */}
          <Route path="/play-lab/:catId" element={<PlayLabScreen {...sharedProps} />} />
          <Route path="/outdoor/:catId" element={<OutdoorConfidenceScreen {...sharedProps} />} />

          {/* Life & Identity */}
          <Route path="/life-stage/:catId" element={<LifeStageScreen {...sharedProps} />} />
          <Route path="/gallery/:catId" element={<GalleryScreen {...sharedProps} />} />

          {/* Routines & Safety */}
          <Route path="/environment/:catId" element={<EnvironmentAuditScreen {...sharedProps} />} />
          <Route path="/cleaning/:catId" element={<CleaningLogScreen {...sharedProps} />} />
          <Route path="/sitter/:catId" element={<SitterModeScreen {...sharedProps} />} />
          <Route path="/human-injury/:catId" element={<HumanInjuryLogScreen {...sharedProps} />} />

          {/* AI */}
          <Route path="/ai-companion/:catId" element={<AICompanionScreen {...sharedProps} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
