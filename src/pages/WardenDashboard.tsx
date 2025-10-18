import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, Calendar, DollarSign, Bed, Home, Pencil, Trash2, Plus, RefreshCw, X, Loader2 } from 'lucide-react'; // Added Loader2 for loading states
import { useEffect, useState, useCallback } from 'react';
import { getHostels, createRoom, updateRoom, deleteRoom, createBed, updateBed, deleteBed } from '@/lib/api';
import { displayRoomType } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label'; // Added Label import for form consistency
import { toast } from 'sonner';
import { updateHostel } from '@/lib/api';

// *******************************************************************
// All backend-related logic (API calls, state updates, effect dependencies) 
// is kept identical to the original component.
// *******************************************************************

const WardenDashboard = () => {
  const { user, token: authToken } = useAuth();
  const [hostels, setHostels] = useState<any[]>([]);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [editingBed, setEditingBed] = useState<any | null>(null);
  const [selectedHostel, setSelectedHostel] = useState<any | null>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [pricingForm, setPricingForm] = useState<{ default_monthly_rent?: string | null; default_price_per_day?: string | null }>({});
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false); // Added for initial data loading state

  const token = localStorage.getItem('authToken');

  const fetchData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const hs = await getHostels();
      const mine = hs.filter((h: any) => h.warden === user?.id);
      setHostels(mine);
      
      const newSelectedHostel = mine.find((h: any) => h.id === selectedHostel?.id) || mine[0] || null;
      setSelectedHostel(newSelectedHostel);
      
      if (newSelectedHostel) {
        const newSelectedRoom = newSelectedHostel.rooms?.find((r: any) => r.id === selectedRoom?.id) || newSelectedHostel.rooms?.[0] || null;
        setSelectedRoom(newSelectedRoom);
      } else {
        setSelectedRoom(null);
      }
    } catch (err) {
      console.error('Failed to load warden data', err);
      toast.error('Failed to load dashboard data.');
    } finally {
      setIsDataLoading(false);
    }
  }, [user, selectedHostel?.id, selectedRoom?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Keep DEBUG logic identical
  useEffect(() => {
    if (!selectedHostel) {
      console.debug('WardenDashboard: selectedHostel is null');
      return;
    }
    const privateRoom = selectedHostel.rooms?.find((r:any) => r.room_type === 'PRIVATE');
    const dormRoom = selectedHostel.rooms?.find((r:any) => r.room_type === 'DORM');
    console.debug('WardenDashboard: selectedHostel', { id: selectedHostel.id, rooms: selectedHostel.rooms?.length });
    console.debug('WardenDashboard: sample prices', {
      PRIVATE: privateRoom ? (privateRoom.monthly_rent || privateRoom.price_per_night) : null,
      DORM: dormRoom ? (dormRoom.monthly_rent || dormRoom.price_per_night) : null,
    });
  }, [selectedHostel]);

  // Keep CRUD logic identical
  const onSaveRoom = async (room: any) => {
    if (!token) return toast.error('Not authenticated');
    try {
      if (room.id) {
        await updateRoom(room.id, room, token);
        toast.success('Room updated');
      } else {
        await createRoom(room.hostel, room, token);
        toast.success('Room created');
      }
      setEditingRoom(null);
      await fetchData();
    } catch (err) {
      toast.error('Failed to save room');
      console.error(err);
    }
  };

  const onDeleteRoom = async (roomId: number) => {
    if (!token) return toast.error('Not authenticated');
    try {
      await deleteRoom(roomId, token);
      toast.success('Room deleted');
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete room');
    }
  };

  const onSaveBed = async (bed: any) => {
    if (!token) return toast.error('Not authenticated');
    try {
      if (bed.id) {
        await updateBed(bed.id, bed, token);
        toast.success('Bed updated');
      } else {
        await createBed(bed.room, bed, token);
        toast.success('Bed created');
      }
      setEditingBed(null);
      await fetchData();
    } catch (err) {
      toast.error('Failed to save bed');
      console.error(err);
    }
  };

  const onDeleteBed = async (bedId: number) => {
    if (!token) return toast.error('Not authenticated');
    try {
      await deleteBed(bedId, token);
      toast.success('Bed deleted');
      await fetchData();
    } catch (err) {
      toast.error('Failed to delete bed');
    }
  };

  const handleSavePricing = async () => {
    const tokenLocal = authToken || localStorage.getItem('authToken');
    if (!tokenLocal) return toast.error('Not authenticated');
    if (!selectedHostel) return toast.error('No hostel selected.');

    const payload: any = {};
    const monthlyRent = pricingForm.default_monthly_rent;
    const pricePerDay = pricingForm.default_price_per_day;

    payload.default_monthly_rent = (monthlyRent === '' || monthlyRent == null) ? null : (Number.isNaN(Number(monthlyRent)) ? null : Number(monthlyRent));
    payload.default_price_per_day = (pricePerDay === '' || pricePerDay == null) ? null : (Number.isNaN(Number(pricePerDay)) ? null : Number(pricePerDay));
    
    try {
      await updateHostel(selectedHostel.id, payload, tokenLocal);
      toast.success('Pricing updated');
      setPricingModalOpen(false);
      await fetchData(); 
    } catch (err: any) {
      console.error('Pricing update failed', err);
      try {
        const parsed = JSON.parse(err.message);
        const msg = parsed.detail || JSON.stringify(parsed);
        toast.error(`Failed to update pricing: ${msg}`);
      } catch (parseErr) {
        toast.error('Failed to update pricing');
      }
    }
  };

  // *** UI RENDERING STARTS HERE ***

  // const totalBeds = selectedHostel?.rooms?.reduce((acc: number, r: any) => acc + (r.beds?.length || 0), 0) || 0;
  // const availableBeds = selectedHostel?.rooms?.reduce((acc: number, r: any) => acc + (r.beds?.filter((b: any) => b.is_available).length || 0), 0) || 0;
  // const occupiedBeds = totalBeds - availableBeds;


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b bg-white shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Warden Dashboard</h1>
          <p className="text-sm text-gray-500">Manage all your properties, rooms, and beds — {user?.username}</p>
        </div>
        <Button onClick={() => fetchData()} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" disabled={isDataLoading}>
          {isDataLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />} 
          Refresh
        </Button>
      </header>

      {isDataLoading && hostels.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="ml-3 text-lg text-gray-600">Loading your data...</p>
        </div>
      ) : (
        <div className="flex flex-1 gap-6 p-4 sm:p-8 flex-col lg:flex-row">
          
          {/* Left Sidebar: Hostels & Pricing (Always visible, stacks on mobile) */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <Card className="shadow-lg lg:sticky lg:top-20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Home className="w-5 h-5 mr-2 text-blue-600" /> My Hostels ({hostels.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hostels.map(h => (
                  <button 
                    key={h.id} 
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all border-2 ${selectedHostel?.id === h.id ? 'bg-blue-50 border-blue-600 font-semibold shadow-md' : 'border-gray-200 hover:bg-gray-50'}`} 
                    onClick={() => { setSelectedHostel(h); setSelectedRoom(h.rooms?.[0] || null); }}
                  >
                    <div className={`text-base ${selectedHostel?.id === h.id ? 'text-blue-700' : 'text-gray-800'}`}>{h.name}</div>
                    <div className="text-xs text-gray-500 truncate">{h.address}</div>
                  </button>
                ))}
                {hostels.length === 0 && <div className="text-sm text-gray-500 p-4 text-center">No hostels managed by you.</div>}
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="shadow-lg lg:sticky lg:top-[20rem]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Default Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                    <div className="text-xs text-green-700 font-medium">Monthly Rent</div>
                    <div className="text-xl font-bold mt-1 text-green-800">
                      {selectedHostel?.default_monthly_rent ? `₹${selectedHostel.default_monthly_rent}` : '—'}
                    </div>
                  </div>
                  <div className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                    <div className="text-xs text-green-700 font-medium">Daily Rate</div>
                    <div className="text-xl font-bold mt-1 text-green-800">
                      {selectedHostel?.default_price_per_day ? `₹${selectedHostel.default_price_per_day}` : '—'}
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={!selectedHostel || user?.profile?.user_type !== 'WARDEN'} 
                  onClick={() => { 
                    setPricingForm({ 
                      default_monthly_rent: selectedHostel?.default_monthly_rent || '', 
                      default_price_per_day: selectedHostel?.default_price_per_day || '' 
                    }); 
                    setPricingModalOpen(true); 
                  }}>
                  <Pencil className="w-4 h-4 mr-2" /> Manage Pricing
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Center: Room Management */}
          <main className="flex-1 min-w-0">
            <Card className="shadow-lg h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {selectedHostel ? `${selectedHostel.name} — Room Inventory` : 'Select a Hostel'}
                </CardTitle>
                <Button onClick={() => setEditingRoom({ hostel: selectedHostel?.id, room_type: 'DORM', capacity: 4 })} disabled={!selectedHostel} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Add New Room
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 h-[calc(100%-65px)] overflow-y-auto">
                {!selectedHostel ? (
                  <div className="text-center p-10 text-gray-500">
                    <Home className="w-10 h-10 mx-auto mb-3" />
                    <p className="font-medium">Please select a hostel from the list to manage its rooms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(selectedHostel?.rooms || []).map((r:any) => {
                      const roomBeds = r.beds || [];
                      const available = roomBeds.some((b:any) => b.is_available);
                      // const occupied = roomBeds.filter((b:any) => !b.is_available).length;
                      const tileClasses = `rounded-xl p-5 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-lg transition-all border-2 ${selectedRoom?.id === r.id ? 'border-blue-600 bg-blue-50' : available ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'}`;
                      
                      return (
                        <div key={r.id} className={tileClasses} onClick={() => setSelectedRoom(r)}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xl font-bold">{r.room_number ? `Room ${r.room_number}` : `Room #${r.id}`}</div>
                              <div className="text-sm uppercase tracking-wider font-medium text-blue-600">{displayRoomType(r.room_type)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{r.capacity} Beds</div>
                              {r.monthly_rent && <div className="text-base font-bold text-green-700">₹{r.monthly_rent}/mo</div>}
                              <div className={`text-xs ${r.monthly_rent ? 'text-gray-500' : 'text-green-700 font-bold'}`}>₹{r.price_per_night}/day</div>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-dashed border-gray-300">
                            <div className="flex items-center justify-between text-sm">
                              <div className={`font-semibold ${available ? 'text-emerald-600' : 'text-red-500'}`}>
                                {available ? 'Available Beds: ' : 'Fully Occupied: '} {roomBeds.filter((b: any) => b.is_available).length} / {roomBeds.length}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-blue-600 border-blue-600 hover:bg-blue-100" onClick={(e:any) => { e.stopPropagation(); setEditingRoom({ ...r, hostel: selectedHostel.id }); }}><Pencil className="w-4 h-4" /></Button>
                                <Button size="sm" variant="destructive" className="h-7 w-7 p-0 bg-red-500 hover:bg-red-600" onClick={async (e:any) => { e.stopPropagation(); await onDeleteRoom(r.id); }}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* Empty state for rooms */}
                    {(selectedHostel?.rooms || []).length === 0 && (
                      <div className="col-span-full text-center p-10 text-gray-500 border border-dashed rounded-xl">
                        <Bed className="w-8 h-8 mx-auto mb-3" />
                        <p>No rooms found. Click "Add New Room" to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>

          {/* Right Panel: Room & Bed Details (Always visible, stacks on mobile) */}
          <aside className="w-full lg:w-96 shrink-0 space-y-6">
            <Card className="shadow-lg lg:sticky lg:top-20">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-purple-600" /> Bed Management
                </CardTitle>
                {/* FIX: Replaced DialogDescription with a standard paragraph element */}
                <p className="text-sm text-gray-500">
                  {selectedRoom ? `${displayRoomType(selectedRoom.room_type)} · Room #${selectedRoom.room_number || selectedRoom.id}` : 'Select a room for details'}
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {!selectedRoom ? (
                  <div className="text-sm text-gray-500 text-center p-4">
                    Select a room from the inventory to view and manage its beds.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div className="font-bold text-lg text-gray-800">Beds ({selectedRoom.beds?.length || 0})</div>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700" 
                        onClick={() => setEditingBed({ room: selectedRoom.id, is_available: true })}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
                      {selectedRoom.beds?.map((b:any) => (
                        <div key={b.id} className={`rounded-lg shadow border transition-all p-3 flex flex-col justify-between ${b.is_available ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                          <div className="mb-2">
                            <div className="font-bold text-md text-gray-800">Bed #{b.bed_number}</div>
                            <div className={`text-xs font-semibold ${b.is_available ? 'text-emerald-700' : 'text-red-700'}`}>
                              {b.is_available ? 'Available' : 'Unavailable'}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="xs" className="h-7 p-2 bg-blue-500 hover:bg-blue-600" onClick={() => setEditingBed({ ...b, room: selectedRoom.id })}><Pencil className="w-3 h-3" /></Button>
                            <Button size="xs" variant="destructive" className="h-7 p-2 bg-red-500 hover:bg-red-600" onClick={async () => await onDeleteBed(b.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      )}

      {/* MODALS/DIALOGS - Functionality remains the same */}
      
      {/* Edit Room Dialog */}
      <Dialog open={!!editingRoom} onOpenChange={v => !v && setEditingRoom(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl font-bold text-gray-800">
              <Bed className="w-5 h-5 mr-2 text-blue-600" /> {editingRoom?.id ? 'Edit Room' : 'Add New Room'}
            </DialogTitle>
            <DialogDescription>
              Adjust room details, type, capacity, and pricing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-sm font-medium">Room Type</Label>
              <select value={editingRoom?.room_type || ''} onChange={(e:any) => setEditingRoom(prev => ({ ...prev, room_type: e.target.value }))} className="w-full border rounded-lg px-3 py-2 mt-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="">Select type</option>
                <option value="PRIVATE">{displayRoomType('PRIVATE')} Room</option>
                <option value="DORM">{displayRoomType('DORM')} Room</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Room Number</Label>
              <Input type="text" placeholder="e.g., A101" value={editingRoom?.room_number || ''} onChange={(e:any) => setEditingRoom(prev => ({ ...prev, room_number: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium">Capacity (Max Beds)</Label>
              <Input type="number" placeholder="e.g., 4" value={editingRoom?.capacity || ''} onChange={(e:any) => setEditingRoom(prev => ({ ...prev, capacity: Number(e.target.value) }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium">Price per night (INR)</Label>
              <Input type="number" placeholder="e.g., 500" value={editingRoom?.price_per_night || ''} onChange={(e:any) => setEditingRoom(prev => ({ ...prev, price_per_night: e.target.value }))} className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEditingRoom(null)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
            <Button onClick={() => onSaveRoom(editingRoom)} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Bed Dialog */}
      <Dialog open={!!editingBed} onOpenChange={v => !v && setEditingBed(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl font-bold text-gray-800">
              <Bed className="w-5 h-5 mr-2 text-purple-600" /> {editingBed?.id ? 'Edit Bed' : 'Add New Bed'}
            </DialogTitle>
            <DialogDescription>
              Set bed number and availability status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-sm font-medium">Bed Number</Label>
              <Input type="number" placeholder="e.g., 1" value={editingBed?.bed_number || ''} onChange={(e:any) => setEditingBed(prev => ({ ...prev, bed_number: Number(e.target.value) }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium">Availability Status</Label>
              <select value={editingBed?.is_available === undefined ? 'true' : (editingBed?.is_available ? 'true' : 'false')} onChange={(e:any) => setEditingBed(prev => ({ ...prev, is_available: e.target.value === 'true' }))} className="w-full border rounded-lg px-3 py-2 mt-1 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEditingBed(null)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
            <Button onClick={() => onSaveBed(editingBed)} className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Manage Pricing Modal */}
      {pricingModalOpen && selectedHostel && (
        <Dialog open={pricingModalOpen} onOpenChange={(v) => !v && setPricingModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl font-bold text-gray-800">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Manage Pricing for {selectedHostel.name}
              </DialogTitle>
              <DialogDescription>
                Set the default monthly and daily prices for this hostel. These values can be overridden per room.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-sm font-medium">Default Monthly Rent (INR)</Label>
                <Input type="number" placeholder="Leave empty for no default monthly rent" value={pricingForm.default_monthly_rent ?? ''} onChange={(e:any) => setPricingForm(prev => ({ ...prev, default_monthly_rent: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">Default One Day Price (INR)</Label>
                <Input type="number" placeholder="Leave empty for no default daily rate" value={pricingForm.default_price_per_day ?? ''} onChange={(e:any) => setPricingForm(prev => ({ ...prev, default_price_per_day: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setPricingModalOpen(false)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
              <Button onClick={handleSavePricing} className="bg-green-600 hover:bg-green-700">Save Pricing</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default WardenDashboard;