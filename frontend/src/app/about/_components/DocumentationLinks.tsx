import React from 'react';

export const DocumentationLinks: React.FC = () => {
  const documentationItems = [
    {
      title: 'Technical Whitepaper',
      description: 'Comprehensive technical documentation covering our architecture, algorithms, and security model.',
      icon: '📄',
      link: 'https://docs.pure-l.com/whitepaper',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'GitHub Repository',
      description: 'Open source smart contracts, frontend code, and development tools.',
      icon: '💻',
      link: 'https://github.com/pure-l',
      color: 'from-slate-500 to-slate-600',
      bgColor: 'from-slate-50 to-slate-100',
      borderColor: 'border-slate-200'
    },
    {
      title: 'API Documentation',
      description: 'Complete API reference for developers building on top of Pure-L.',
      icon: '🔌',
      link: 'https://docs.pure-l.com/api',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      title: 'Security Audit Report',
      description: 'Third-party security audit results and smart contract verification.',
      icon: '🔒',
      link: 'https://docs.pure-l.com/security',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Integration Guide',
      description: 'Step-by-step guide for integrating Pure-L into your DeFi application.',
      icon: '⚡',
      link: 'https://docs.pure-l.com/integration',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Governance Documentation',
      description: 'Learn about our governance model and how to participate in protocol decisions.',
      icon: '🗳️',
      link: 'https://docs.pure-l.com/governance',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200'
    }
  ];

  const quickLinks = [
    {
      title: 'Getting Started',
      description: 'Quick start guide for new users',
      link: 'https://docs.pure-l.com/getting-started'
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions',
      link: 'https://docs.pure-l.com/faq'
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      link: 'https://docs.pure-l.com/troubleshooting'
    },
    {
      title: 'Community Forum',
      description: 'Discuss with other users',
      link: 'https://forum.pure-l.com'
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
          Documentation & Resources
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4"></div>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Everything you need to understand, integrate, and build with Pure-L. 
          Our documentation is comprehensive, developer-friendly, and always up-to-date.
        </p>
      </div>

      {/* Main Documentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {documentationItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group bg-gradient-to-br ${item.bgColor} rounded-2xl p-8 border ${item.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Read More
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Links Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-slate-900">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
            >
              <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {link.title}
              </h4>
              <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Developer Resources */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Developer Resources</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Build the future of DeFi with our comprehensive developer tools and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">SDK & Libraries</h4>
            <p className="text-sm text-slate-600 mb-4">
              JavaScript, Python, and Go SDKs for easy integration
            </p>
            <a
              href="https://github.com/pure-l/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View SDK →
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Testnet Access</h4>
            <p className="text-sm text-slate-600 mb-4">
              Deploy and test on our dedicated testnet environment
            </p>
            <a
              href="https://testnet.pure-l.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Access Testnet →
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Developer Support</h4>
            <p className="text-sm text-slate-600 mb-4">
              Get help from our technical team and community
            </p>
            <a
              href="https://discord.gg/pure-l-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              Join Discord →
            </a>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Need Help?</h3>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Our team is here to help you get started 
          and answer any questions you might have.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@pure-l.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
          <a
            href="https://calendly.com/pure-l/consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-full border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Consultation
          </a>
        </div>
      </div>
    </section>
  );
};
