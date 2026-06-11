import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Destination = {
  id: string;
  name: string;
  code: string;
  isStart: boolean;
  nights: number;
  isEnd: boolean;
};

export type Flight = {
  id: string;
  airline: string;
  code: string;
  depart: string;
  arrive: string;
  duration: string;
  type: string;
  price: number;
  isBest: boolean;
};

export type Passengers = {
  adults: number;
  children: number;
  infants: number;
};

export type SavedTrip = {
  id: string;
  destinations: Destination[];
  passengers: Passengers;
  departDate: Date;
  selectedFlights: Record<number, Flight>;
  status: 'Confirmed' | 'Draft';
  createdAt: Date;
};

export type NotificationItem = {
  id: number;
  type: string;
  icon: string;
  color: string;
  bg: string;
  text: string;
  time: string;
};

export type NotificationGroup = {
  section: string;
  data: NotificationItem[];
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  dob: string;
};

export type UserSettings = {
  language: string;
  currency: string;
  twoFactor: boolean;
  biometrics: boolean;
  notificationsEnabled: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationGroup[] = [
  {
    section: 'Today',
    data: [
      { id: 1, type: 'Booking Confirmed', icon: 'airplane', color: '#FF3B5C', bg: '#FFF0F2', text: 'Your flight to Goa is confirmed.', time: 'Just now' },
      { id: 2, type: 'Price Drop Alert', icon: 'trending-down', color: '#1A1A1A', bg: '#F5F5F5', text: 'Flights to Manali dropped by 15%.', time: '2 hr ago' },
    ]
  },
  {
    section: 'Yesterday',
    data: [
      { id: 3, type: 'Trip Reminder', icon: 'calendar', color: '#FF3B30', bg: '#FFF0F0', text: 'Your trip to Bangalore starts\ntomorrow.', time: '5:12 pm' },
      { id: 4, type: 'Special Promo', icon: 'pricetag', color: '#FFB800', bg: '#FFF9E6', text: 'Get 20% off on your next hotel\nbooking.', time: '2:25 pm' },
      { id: 5, type: 'Profile Completed!', icon: 'person', color: '#20C968', bg: '#E4F8EB', text: 'Your travel profile is now 100%\ncomplete.', time: '12:30 pm' },
      { id: 6, type: 'Support Team', icon: 'headset', color: '#20C968', bg: '#E4F8EB', text: 'We have resolved your recent ticket.', time: '8:55 am' },
    ]
  }
];

type TripContextType = {
  destinations: Destination[];
  setDestinations: (d: Destination[]) => void;
  passengers: Passengers;
  setPassengers: (p: Passengers) => void;
  departDate: Date;
  setDepartDate: (d: Date) => void;
  selectedFlights: Record<number, Flight>; // key: legIndex, value: Flight
  setSelectedFlights: React.Dispatch<React.SetStateAction<Record<number, Flight>>>;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (v: boolean) => void;
  savedTrips: SavedTrip[];
  saveTripAsDraft: () => void;
  confirmTrip: () => void;
  clearBuilder: () => void;
  notifications: NotificationGroup[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationGroup[]>>;
  profileImageUri: string;
  setProfileImageUri: (uri: string) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: 'maa', name: 'Chennai', code: 'MAA', isStart: true, nights: 0, isEnd: false },
    { id: 'blr', name: 'Bangalore', code: 'BLR', isStart: false, nights: 3, isEnd: false },
    { id: 'goi', name: 'Goa', code: 'GOI', isStart: false, nights: 2, isEnd: false },
    { id: 'bom', name: 'Mumbai', code: 'BOM', isStart: false, nights: 0, isEnd: true },
  ]);

  const [passengers, setPassengers] = useState<Passengers>({ adults: 2, children: 1, infants: 0 });
  const [departDate, setDepartDate] = useState<Date>(new Date('2024-08-12'));
  const [selectedFlights, setSelectedFlights] = useState<Record<number, Flight>>({});
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [notifications, setNotifications] = useState<NotificationGroup[]>(INITIAL_NOTIFICATIONS);
  const [profileImageUri, setProfileImageUri] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Faheem',
    email: 'faheem@example.com',
    phone: '+91 98765 43210',
    dob: '15 August 1995'
  });
  
  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: 'en-in',
    currency: 'inr',
    twoFactor: false,
    biometrics: true,
    notificationsEnabled: true
  });

  const saveTripAsDraft = () => {
    const newTrip: SavedTrip = {
      id: Math.random().toString(36).substr(2, 9),
      destinations: [...destinations],
      passengers: { ...passengers },
      departDate: new Date(departDate),
      selectedFlights: { ...selectedFlights },
      status: 'Draft',
      createdAt: new Date(),
    };
    setSavedTrips(prev => [newTrip, ...prev]);
  };

  const confirmTrip = () => {
    const newTrip: SavedTrip = {
      id: Math.random().toString(36).substr(2, 9),
      destinations: [...destinations],
      passengers: { ...passengers },
      departDate: new Date(departDate),
      selectedFlights: { ...selectedFlights },
      status: 'Confirmed',
      createdAt: new Date(),
    };
    setSavedTrips(prev => [newTrip, ...prev]);

    const mainDest = destinations.find(d => !d.isStart)?.name || 'your destination';
    
    const successNotif = {
      id: Date.now(),
      type: 'Booking Confirmed',
      icon: 'checkmark-circle',
      color: '#20C968',
      bg: '#E4F8EB',
      text: `Your trip to ${mainDest} was booked successfully!`,
      time: 'Just now'
    };

    const CITY_SUGGESTIONS: Record<string, string> = {
      'Chennai': 'Marina Beach',
      'Bangalore': 'Cubbon Park',
      'Goa': 'Baga Beach',
      'Mumbai': 'the Gateway of India',
      'Delhi': 'the Red Fort',
      'Hyderabad': 'Charminar',
      'Kolkata': 'Victoria Memorial'
    };
    
    const popularPlace = CITY_SUGGESTIONS[mainDest] || 'the local popular spots';

    const suggestionNotif = {
      id: Date.now() + 1,
      type: 'Local Suggestion',
      icon: 'map',
      color: '#0055FF',
      bg: '#EEF4FF',
      text: `Don't forget to visit ${popularPlace} while you're in ${mainDest}!`,
      time: 'Just now'
    };

    setNotifications(prev => {
      const newGroups = [...prev];
      const todayIndex = newGroups.findIndex(g => g.section === 'Today');
      if (todayIndex >= 0) {
        newGroups[todayIndex].data = [successNotif, suggestionNotif, ...newGroups[todayIndex].data];
      } else {
        newGroups.unshift({ section: 'Today', data: [successNotif, suggestionNotif] });
      }
      return newGroups;
    });
  };

  const clearBuilder = () => {
    setDestinations([
      { id: 'maa', name: 'Chennai', code: 'MAA', isStart: true, nights: 0, isEnd: false },
      { id: 'blr', name: 'Bangalore', code: 'BLR', isStart: false, nights: 3, isEnd: false },
      { id: 'goi', name: 'Goa', code: 'GOI', isStart: false, nights: 2, isEnd: false },
      { id: 'bom', name: 'Mumbai', code: 'BOM', isStart: false, nights: 0, isEnd: true },
    ]);
    setPassengers({ adults: 1, children: 0, infants: 0 });
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setDepartDate(d);
    setSelectedFlights({});
  };

  return (
    <TripContext.Provider value={{
      destinations,
      setDestinations,
      passengers,
      setPassengers,
      departDate,
      setDepartDate,
      selectedFlights,
      setSelectedFlights,
      hasSeenOnboarding,
      setHasSeenOnboarding,
      savedTrips,
      saveTripAsDraft,
      confirmTrip,
      clearBuilder,
      notifications,
      setNotifications,
      profileImageUri,
      setProfileImageUri,
      userProfile,
      setUserProfile,
      userSettings,
      setUserSettings
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
