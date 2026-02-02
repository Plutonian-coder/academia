'use client';

import { Title, Text, Card, Switch } from '@tremor/react';

export default function SettingsPage() {
    return (
        <div>
            {/* Page Header */}
            <div className="mb-6">
                <Title className="text-2xl text-slate-800">Settings</Title>
                <Text className="text-slate-600">
                    Configure dashboard preferences and display options
                </Text>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* General Settings */}
                <Card className="bg-white border border-slate-200">
                    <Title className="text-lg text-slate-800 mb-4">General Settings</Title>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <div>
                                <Text className="font-medium text-slate-700">Auto-refresh Dashboard</Text>
                                <Text className="text-sm text-slate-500">Automatically refresh data every 5 minutes</Text>
                            </div>
                            <Switch />
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <div>
                                <Text className="font-medium text-slate-700">Show At-Risk Alerts</Text>
                                <Text className="text-sm text-slate-500">Display notifications for at-risk students</Text>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex justify-between items-center py-3">
                            <div>
                                <Text className="font-medium text-slate-700">Compact View</Text>
                                <Text className="text-sm text-slate-500">Use smaller cards and charts</Text>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </Card>

                {/* Data Settings */}
                <Card className="bg-white border border-slate-200">
                    <Title className="text-lg text-slate-800 mb-4">Data Settings</Title>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <div>
                                <Text className="font-medium text-slate-700">Session</Text>
                                <Text className="text-sm text-slate-500">Current academic session</Text>
                            </div>
                            <Text className="font-medium text-emerald-600">2024/2025</Text>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <div>
                                <Text className="font-medium text-slate-700">Semester</Text>
                                <Text className="text-sm text-slate-500">Current semester</Text>
                            </div>
                            <Text className="font-medium text-emerald-600">1st Semester</Text>
                        </div>

                        <div className="flex justify-between items-center py-3">
                            <div>
                                <Text className="font-medium text-slate-700">Data Source</Text>
                                <Text className="text-sm text-slate-500">CSV file location</Text>
                            </div>
                            <Text className="text-sm text-slate-600 font-mono">yabatech_expanded_data.csv</Text>
                        </div>
                    </div>
                </Card>

                {/* About */}
                <Card className="bg-gradient-to-br from-slate-50 to-emerald-50 border border-slate-200">
                    <Title className="text-lg text-slate-800 mb-4">About</Title>

                    <div className="space-y-2 text-sm">
                        <p className="text-slate-600">
                            <span className="font-medium">Project:</span> Analysis of Student Academic Performance Data
                        </p>
                        <p className="text-slate-600">
                            <span className="font-medium">Institution:</span> Yaba College of Technology
                        </p>
                        <p className="text-slate-600">
                            <span className="font-medium">Type:</span> Final Year Project
                        </p>
                        <p className="text-slate-600">
                            <span className="font-medium">Tech Stack:</span> Next.js 14, FastAPI, Pandas, Tremor
                        </p>
                        <p className="text-slate-500 mt-4 text-xs">
                            © 2024 YabaTech Analytics. All rights reserved.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
