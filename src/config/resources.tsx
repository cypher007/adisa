import type { IResourceItem } from "@refinedev/core";

import {
    UsergroupAddOutlined,
    SafetyOutlined
  } from "@ant-design/icons";

export const resources: IResourceItem[] = [
{
    name: "profiles",
    meta: {
        label: "Profiles",
        icon: <UsergroupAddOutlined />
    },
},
{
    name: "profile_audits",
    list: "/profile_audits",
    create: "/profile_audits/create",
    edit: "/profile_audits/edit/:id",
    show: "/profile_audits/show/:id",
    meta: {
        canDelete: true,
        parent: "profiles",
        label: "Audits"
    },
},
{
    name: "profiles",
    list: "/profiles",
    create: "/profiles/create",
    edit: "/profiles/edit/:id",
    show: "/profiles/show/:id",
    meta: {
        canDelete: true,
        parent: "profiles",
        label: "Listes"
    },
},
{
    name: "audits",
    meta: {
        label: "Audits",
        icon: <SafetyOutlined />
    },
},
{
    name: "audits",
    list: "/audits",
    create: "/audits/create",
    edit: "/audits/edit/:id",
    show: "/audits/show/:id",
    meta: {
        canDelete: true,
        label: "Listes",
        parent: "audits",
    },
},
{
    name: "questions",
    list: "/questions",
    create: "/questions/create",
    edit: "/questions/edit/:id",
    show: "/questions/show/:id",
    meta: {
        canDelete: true,
        label: "Questions",
        parent: "audits",
    },
},
];