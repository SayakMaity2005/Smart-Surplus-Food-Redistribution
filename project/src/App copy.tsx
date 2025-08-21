import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import SignIn from './components/SignIn';
import DonorDashboard from './components/DonorDashboard';
import RecipientDashboard from './components/RecipientDashboard';
import EventsPage from './components/EventsPage';
import FoodItemsList from './components/FoodItemsList';
import SurplusFoodList from './components/SurplusFoodList';
import AddDonationForm from './components/AddDonationForm';
import RequestFoodForm from './components/RequestFoodForm';
import ImpactReport from './components/ImpactReport';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/food-items" element={<FoodItemsList />} />
            <Route path="/surplus-food" element={<SurplusFoodList />} />
            <Route path="/add-donation" element={<AddDonationForm />} />
            <Route path="/request-food" element={<RequestFoodForm />} />
          <Route path="/impact-report" element={<ImpactReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;