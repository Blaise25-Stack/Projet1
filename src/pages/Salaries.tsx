import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';
import { TeacherSalary, TeacherAdvance, MonthlySalaryCost, User } from '../types';
import { Plus, Search, Eye, Download, CreditCard, DollarSign, Calendar, User as UserIcon, TrendingUp } from 'lucide-react';

const Salaries: React.FC = () => {
  const { user } = useAuth();
  const [teachers] = useState<User[]>(db.getUsers().filter(u => u.role === 'teacher'));
  const [salaries, setSalaries] = useState<TeacherSalary[]>([]);
  const [advances, setAdvances] = useState<TeacherAdvance[]>([]);
  const [monthlyCosts, setMonthlyCosts] = useState<MonthlySalaryCost[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [activeTab, setActiveTab] = useState<'salaries' | 'advances' | 'costs'>('salaries');
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);

  const [salaryFormData, setSalaryFormData] = useState({
    teacherId: '',
    baseSalary: '',
    bonuses: '',
    deductions: '',
    month: new Date().toISOString().slice(0, 7),
    notes: ''
  });

  const [advanceFormData, setAdvanceFormData] = useState({
    teacherId: '',
    amount: '',
    reason: '',
    method: 'especes' as TeacherAdvance['method'],
    month: new Date().toISOString().slice(0, 7)
  });

  const handleSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseSalary = parseFloat(salaryFormData.baseSalary);
    const bonuses = parseFloat(salaryFormData.bonuses) || 0;
    const deductions = parseFloat(salaryFormData.deductions) || 0;
    
    // Calculer les accomptes déjà versés pour ce mois
    const teacherAdvances = advances.filter(a => 
      a.teacherId === salaryFormData.teacherId && 
      a.month === salaryFormData.month
    );
    const totalAdvances = teacherAdvances.reduce((sum, a) => sum + a.amount, 0);
    
    const totalPaid = totalAdvances + bonuses;
    const remainingBalance = baseSalary - totalPaid - deductions;
    
    const newSalary: TeacherSalary = {
      id: Date.now().toString(),
      teacherId: salaryFormData.teacherId,
      baseSalary,
      advances: teacherAdvances,
      bonuses,
      deductions,
      month: salaryFormData.month,
      year: salaryFormData.month.split('-')[0],
      totalPaid,
      remainingBalance,
      status: remainingBalance <= 0 ? 'completed' : totalPaid > 0 ? 'partial' : 'pending',
      notes: salaryFormData.notes
    };
    
    setSalaries([...salaries, newSalary]);
    resetSalaryForm();
  };

  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAdvance: TeacherAdvance = {
      id: Date.now().toString(),
      teacherId: advanceFormData.teacherId,
      amount: parseFloat(advanceFormData.amount),
      date: new Date().toISOString().split('T')[0],
      reason: advanceFormData.reason,
      method: advanceFormData.method,
      approvedBy: user?.id || '',
      receiptNumber: `ADV${Date.now()}`,
      month: advanceFormData.month,
      year: advanceFormData.month.split('-')[0]
    };
    
    setAdvances([...advances, newAdvance]);
    resetAdvanceForm();
  };

  const resetSalaryForm = () => {
    setSalaryFormData({
      teacherId: '',
      baseSalary: '',
      bonuses: '',
      deductions: '',
      month: new Date().toISOString().slice(0, 7),
      notes: ''
    });
    setShowSalaryModal(false);
  };

  const resetAdvanceForm = () => {
    setAdvanceFormData({
      teacherId: '',
      amount: '',
      reason: '',
      method: 'especes',
      month: new Date().toISOString().slice(0, 7)
    });
    setShowAdvanceModal(false);
  };

  const generateMonthlyCost = () => {
    const monthSalaries = salaries.filter(s => s.month === selectedMonth);
    const monthAdvances = advances.filter(a => a.month === selectedMonth);
    
    const totalBaseSalaries = monthSalaries.reduce((sum, s) => sum + s.baseSalary, 0);
    const totalAdvances = monthAdvances.reduce((sum, a) => sum + a.amount, 0);
    const totalBonuses = monthSalaries.reduce((sum, s) => sum + s.bonuses, 0);
    const totalDeductions = monthSalaries.reduce((sum, s) => sum + s.deductions, 0);
    const totalCost = totalBaseSalaries + totalBonuses - totalDeductions;
    
    const newMonthlyCost: MonthlySalaryCost = {
      id: Date.now().toString(),
      month: selectedMonth,
      year: selectedMonth.split('-')[0],
      totalBaseSalaries,
      totalAdvances,
      totalBonuses,
      totalDeductions,
      totalCost,
      teacherCount: monthSalaries.length,
      generatedDate: new Date().toISOString()
    };
    
    setMonthlyCosts([...monthlyCosts.filter(c => c.month !== selectedMonth), newMonthlyCost]);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FC`;
  };

  const getStatusColor = (status: TeacherSalary['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: TeacherSalary['status']) => {
    const labels = {
      pending: 'En attente',
      partial: 'Partiel',
      completed: 'Complété'
    };
    return labels[status];
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Accès réservé aux administrateurs</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Salaires</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdvanceModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <DollarSign className="h-5 w-5" />
            <span>Accompte</span>
          </button>
          <button
            onClick={() => setShowSalaryModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau salaire</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('salaries')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'salaries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Salaires
          </button>
          <button
            onClick={() => setActiveTab('advances')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'advances'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Accomptes
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'costs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Coûts mensuels
          </button>
        </nav>
      </div>

      {/* Month Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">Mois</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {activeTab === 'costs' && (
            <button
              onClick={generateMonthlyCost}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Générer coût</span>
            </button>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'salaries' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enseignant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salaire de base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accomptes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Primes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solde restant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaries.filter(s => s.month === selectedMonth).map((salary) => {
                const teacher = teachers.find(t => t.id === salary.teacherId);
                const totalAdvances = salary.advances.reduce((sum, a) => sum + a.amount, 0);
                
                return (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-3">
                          {teacher?.profilePhoto ? (
                            <img 
                              src={teacher.profilePhoto} 
                              alt={teacher.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{teacher?.name}</div>
                          <div className="text-sm text-gray-500">{teacher?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(salary.baseSalary)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(totalAdvances)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {salary.advances.length} versement(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(salary.bonuses)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        salary.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(salary.remainingBalance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(salary.status)}`}>
                        {getStatusLabel(salary.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'advances' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enseignant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Reçu
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advances.filter(a => a.month === selectedMonth).map((advance) => {
                const teacher = teachers.find(t => t.id === advance.teacherId);
                
                return (
                  <tr key={advance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{teacher?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(advance.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{advance.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(advance.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {advance.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{advance.receiptNumber}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'costs' && (
        <div className="space-y-6">
          {monthlyCosts.filter(c => c.month === selectedMonth).map((cost) => (
            <div key={cost.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Coût salarial - {new Date(cost.month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h3>
                <button className="text-blue-600 hover:text-blue-800">
                  <Download className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Salaires de base</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(cost.totalBaseSalaries)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Accomptes versés</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(cost.totalAdvances)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Primes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(cost.totalBonuses)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <UserIcon className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Coût total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(cost.totalCost)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Nombre d'enseignants: {cost.teacherCount}</p>
                <p>Généré le: {new Date(cost.generatedDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nouveau salaire</h3>
            
            <form onSubmit={handleSalarySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Enseignant</label>
                <select
                  required
                  value={salaryFormData.teacherId}
                  onChange={(e) => setSalaryFormData({...salaryFormData, teacherId: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salaire de base (FC)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={salaryFormData.baseSalary}
                  onChange={(e) => setSalaryFormData({...salaryFormData, baseSalary: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primes (FC)</label>
                  <input
                    type="number"
                    min="0"
                    value={salaryFormData.bonuses}
                    onChange={(e) => setSalaryFormData({...salaryFormData, bonuses: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Retenues (FC)</label>
                  <input
                    type="number"
                    min="0"
                    value={salaryFormData.deductions}
                    onChange={(e) => setSalaryFormData({...salaryFormData, deductions: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mois</label>
                <input
                  type="month"
                  required
                  value={salaryFormData.month}
                  onChange={(e) => setSalaryFormData({...salaryFormData, month: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={salaryFormData.notes}
                  onChange={(e) => setSalaryFormData({...salaryFormData, notes: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetSalaryForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advance Modal */}
      {showAdvanceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nouvel accompte</h3>
            
            <form onSubmit={handleAdvanceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Enseignant</label>
                <select
                  required
                  value={advanceFormData.teacherId}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, teacherId: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Montant (FC)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={advanceFormData.amount}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, amount: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Motif</label>
                <input
                  type="text"
                  required
                  value={advanceFormData.reason}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, reason: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Avance sur salaire"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Méthode</label>
                  <select
                    value={advanceFormData.method}
                    onChange={(e) => setAdvanceFormData({...advanceFormData, method: e.target.value as TeacherAdvance['method']})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="especes">Espèces</option>
                    <option value="virement">Virement</option>
                    <option value="mobile">Mobile Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mois de déduction</label>
                  <input
                    type="month"
                    required
                    value={advanceFormData.month}
                    onChange={(e) => setAdvanceFormData({...advanceFormData, month: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetAdvanceForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salaries;