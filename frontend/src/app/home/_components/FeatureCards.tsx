import React from 'react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      title: 'Multi-Provider Auth',
      description: 'Support for Privy, Rainbow Wallet, and Xellar authentication providers',
      icon: '🔐',
      color: 'text-primary',
    },
    {
      title: 'Role-Based Access',
      description: 'Built-in role system with Admin, User, and Public access levels',
      icon: '👥',
      color: 'text-secondary',
    },
    {
      title: 'Modern Stack',
      description: 'React 19, TypeScript, Tailwind CSS, and DaisyUI for rapid development',
      icon: '⚡',
      color: 'text-accent',
    },
    {
      title: 'Data Fetching',
      description: 'Pre-configured Axios and React Query for efficient API communication',
      icon: '📡',
      color: 'text-info',
    },
    {
      title: 'Local Storage',
      description: 'Persistent user sessions and role management with local storage',
      icon: '💾',
      color: 'text-success',
    },
    {
      title: 'Responsive Design',
      description: 'Mobile-first responsive design with beautiful UI components',
      icon: '📱',
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-primary font-bold mb-4">Features</h2>
        <p className="text-lg font-secondary opacity-70 max-w-2xl mx-auto">
          Everything you need to build a modern Web3 application, 
          pre-configured and ready to use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className={`text-4xl mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="card-title text-lg font-primary">{feature.title}</h3>
              <p className="text-sm font-secondary opacity-70">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
