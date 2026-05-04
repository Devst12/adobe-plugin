import React, { useState, useEffect } from "react";
import { DriveBrowser } from "../components/DriveBrowser.jsx";
import { AssetGroupList } from "../components/AssetGroupList.jsx";
import { GroupCreator } from "../components/GroupCreator.jsx";

export const AssetOrganizer = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [draggedAssets, setDraggedAssets] = useState([]);

    const createGroup = (name, assets) => {
        const newGroup = {
            id: Date.now().toString(),
            name,
            assets: assets || [],
            createdAt: new Date().toISOString()
        };
        setGroups([...groups, newGroup]);
    };

    const deleteGroup = (groupId) => {
        setGroups(groups.filter(g => g.id !== groupId));
        if (selectedGroup?.id === groupId) {
            setSelectedGroup(null);
        }
    };

    const addAssetsToGroup = (groupId, assets) => {
        setGroups(groups.map(g => 
            g.id === groupId ? { ...g, assets: [...g.assets, ...assets] } : g
        ));
    };

    return (
        <div className="asset-organizer-container">
            <div className="organizer-header">
                <h1>Asset Organizer Pro</h1>
                <p>Group assets from drives for easy access</p>
            </div>

            <div className="organizer-content">
                <div className="panel-section">
                    <DriveBrowser onAssetsSelected={setDraggedAssets} />
                </div>

                <div className="panel-section">
                    <GroupCreator 
                        selectedAssets={draggedAssets} 
                        onCreateGroup={createGroup}
                    />
                </div>

                <div className="panel-section">
                    <AssetGroupList 
                        groups={groups}
                        selectedGroup={selectedGroup}
                        onSelectGroup={setSelectedGroup}
                        onDeleteGroup={deleteGroup}
                        onAddAssets={addAssetsToGroup}
                    />
                </div>
            </div>
        </div>
    );
};
