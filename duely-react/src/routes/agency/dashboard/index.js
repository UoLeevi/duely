import React from 'react';
import { BsHouse, BsBriefcase, BsKanban, BsCreditCard, BsPeople, BsLayoutTextWindowReverse } from 'react-icons/bs';
import DashboardRoot from 'components/DashboardRoot';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';
import DashboardOverviewMain from 'components/DashboardOverviewMain';

const nav = (
  <Nav items={[
    {
      text: 'Overview',
      icon: BsHouse,
      link: {
        to: '/dashboard',
        end: true
      }
    },
    {
      text: 'Projects',
      icon: BsKanban,
      link: {
        to: '/dashboard/projects',
        end: false
      }
    },
    {
      text: 'Services',
      icon: BsBriefcase,
      link: {
        to: '/dashboard/services',
        end: false
      }
    },
    {
      text: 'Users',
      icon: BsPeople,
      link: {
        to: '/dashboard/users',
        end: false
      },
      items: [
        {
          text: 'Agency',
          link: {
            to: '/dashboard/users/agency',
            end: false
          }
        },
        {
          text: 'Clients',
          link: {
            to: '/dashboard/users/clients',
            end: false
          }
        }
      ]
    },
    {
      text: 'Site',
      icon: BsLayoutTextWindowReverse,
      link: {
        to: '/dashboard/site',
        end: false
      },
      items: [
        {
          text: 'Theme',
          link: {
            to: '/dashboard/site/theme',
            end: false
          }
        }
      ]
    },
    {
      text: 'Payments',
      icon: BsCreditCard,
      link: {
        to: '/dashboard/payments',
        end: false
      }
    }
  ]} />
);

export default [
  {
    path: 'dashboard',
    element: <DashboardRoot />,
    children: [
      {
        path: '/',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Overview" />}
            main={<DashboardOverviewMain />}
          />
        )
      },
      {
        path: 'projects',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Projects" />}
          />
        )
      },
      {
        path: 'services',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Services" />}
          />
        )
      },
      {
        path: 'users',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Users" />}
          />
        )
      },
      {
        path: 'users/agency',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Users" subtitle="Agency" />}
          />
        )
      },
      {
        path: 'users/clients',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Users" subtitle="Clients" />}
          />
        )
      },
      {
        path: 'site',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Site" />}
          />
        )
      },
      {
        path: 'site/theme',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Site" subtitle="Theme" />}
          />
        )
      },
      {
        path: 'payments',
        element: (
          <ResponsiveLayout
            nav={nav}
            header={<HeaderWithActions title="Payments" />}
          />
        )
      }
    ]
  }
];
