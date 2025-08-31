'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { BollingerBandsOptions, BollingerBandsStyle } from '@/lib/types';

interface BollingerSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: BollingerBandsOptions;
  style: BollingerBandsStyle;
  onOptionsChange: (options: BollingerBandsOptions) => void;
  onStyleChange: (style: BollingerBandsStyle) => void;
}

export default function BollingerSettings({
  open,
  onOpenChange,
  options,
  style,
  onOptionsChange,
  onStyleChange,
}: BollingerSettingsProps) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localStyle, setLocalStyle] = useState(style);

  const handleApply = () => {
    onOptionsChange(localOptions);
    onStyleChange(localStyle);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalOptions(options);
    setLocalStyle(style);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Bollinger Bands Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inputs" className="text-sm">Inputs</TabsTrigger>
            <TabsTrigger value="style" className="text-sm">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inputs" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm font-medium">Length</Label>
              <Input
                id="length"
                type="number"
                value={localOptions.length}
                onChange={(e) => setLocalOptions({
                  ...localOptions,
                  length: Math.max(1, parseInt(e.target.value) || 20)
                })}
                min="1"
                max="100"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maType" className="text-sm font-medium">Basic MA Type</Label>
              <Select value={localOptions.maType} onValueChange={(value: 'SMA') => 
                setLocalOptions({ ...localOptions, maType: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMA">SMA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">Source</Label>
              <Select value={localOptions.source} onValueChange={(value: 'close') => 
                setLocalOptions({ ...localOptions, source: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="close">Close</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stdDev" className="text-sm font-medium">StdDev (multiplier)</Label>
              <Input
                id="stdDev"
                type="number"
                step="0.1"
                value={localOptions.stdDevMultiplier}
                onChange={(e) => setLocalOptions({
                  ...localOptions,
                  stdDevMultiplier: Math.max(0.1, parseFloat(e.target.value) || 2)
                })}
                min="0.1"
                max="5"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offset" className="text-sm font-medium">Offset</Label>
              <Input
                id="offset"
                type="number"
                value={localOptions.offset}
                onChange={(e) => setLocalOptions({
                  ...localOptions,
                  offset: parseInt(e.target.value) || 0
                })}
                min="-50"
                max="50"
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-6 mt-6">
            {/* Basic (Middle Band) */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-blue-400">Basic (Middle Band)</Label>
              <div className="space-y-4 pl-4 border-l-2 border-blue-400/30">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Visible</Label>
                  <Switch
                    checked={localStyle.middle.visible}
                    onCheckedChange={(checked) => setLocalStyle({
                      ...localStyle,
                      middle: { ...localStyle.middle, visible: checked }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={localStyle.middle.color}
                      onChange={(e) => setLocalStyle({
                        ...localStyle,
                        middle: { ...localStyle.middle, color: e.target.value }
                      })}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={localStyle.middle.color}
                      onChange={(e) => setLocalStyle({
                        ...localStyle,
                        middle: { ...localStyle.middle, color: e.target.value }
                      })}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Line Width</Label>
                    <span className="text-xs text-muted-foreground">{localStyle.middle.lineWidth}px</span>
                  </div>
                  <Slider
                    value={[localStyle.middle.lineWidth]}
                    onValueChange={([value]) => setLocalStyle({
                      ...localStyle,
                      middle: { ...localStyle.middle, lineWidth: value }
                    })}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Line Style</Label>
                  <Select value={localStyle.middle.lineStyle} onValueChange={(value: 'solid' | 'dashed') => 
                    setLocalStyle({ ...localStyle, middle: { ...localStyle.middle, lineStyle: value } })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Upper Band */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-green-400">Upper Band</Label>
              <div className="space-y-4 pl-4 border-l-2 border-green-400/30">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Visible</Label>
                  <Switch
                    checked={localStyle.upper.visible}
                    onCheckedChange={(checked) => setLocalStyle({
                      ...localStyle,
                      upper: { ...localStyle.upper, visible: checked }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={localStyle.upper.color}
                      onChange={(e) => setLocalStyle({
                        ...localStyle,
                        upper: { ...localStyle.upper, color: e.target.value }
                      })}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={localStyle.upper.color}
                      onChange={(e) => setLocalStyle({
                        ...localStyle,
                        upper: { ...localStyle.upper, color: e.target.value }
                      })}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Line Width</Label>
                    <span className="text-xs text-muted-foreground">{localStyle.upper.lineWidth}px</span>
                  </div>
                  <Slider
                    value={[localStyle.upper.lineWidth]}
                    onValueChange={([value]) => setLocalStyle({
                      ...localStyle,
                      upper: { ...localStyle.upper, lineWidth: value }
                    })}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Line Style</Label>
                  <Select value={localStyle.upper.lineStyle} onValueChange={(value: 'solid' | 'dashed') => 
                    setLocalStyle({ ...localStyle, upper: { ...localStyle.upper, lineStyle: value } })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Lower Band */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-red-400">Lower Band</Label>
              <div className="space-y-4 pl-4 border-l-2 border-red-400/30">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Visible</Label>
                  <Switch
                    checked={localStyle.lower.visible}
                    onCheckedChange={(checked) => setLocalStyle({
                      ...localStyle,
                      lower: { ...localStyle.lower, visible: checked }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={localStyle.lower.color}
                      onChange={(e) => setLocalStyle({
                        ...localStyle,
                        lower: { ...localStyle.lower, color: e.target.value }
                      })}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={localStyle.lower.color}
                      onChange={(e) => setLocalStyle({
                        ...localStyle,
                        lower: { ...localStyle.lower, color: e.target.value }
                      })}
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Line Width</Label>
                    <span className="text-xs text-muted-foreground">{localStyle.lower.lineWidth}px</span>
                  </div>
                  <Slider
                    value={[localStyle.lower.lineWidth]}
                    onValueChange={([value]) => setLocalStyle({
                      ...localStyle,
                      lower: { ...localStyle.lower, lineWidth: value }
                    })}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Line Style</Label>
                  <Select value={localStyle.lower.lineStyle} onValueChange={(value: 'solid' | 'dashed') => 
                    setLocalStyle({ ...localStyle, lower: { ...localStyle.lower, lineStyle: value } })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Background Fill */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-purple-400">Background Fill</Label>
              <div className="space-y-4 pl-4 border-l-2 border-purple-400/30">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Visible</Label>
                  <Switch
                    checked={localStyle.background.visible}
                    onCheckedChange={(checked) => setLocalStyle({
                      ...localStyle,
                      background: { ...localStyle.background, visible: checked }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Opacity</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(localStyle.background.opacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[localStyle.background.opacity * 100]}
                    onValueChange={([value]) => setLocalStyle({
                      ...localStyle,
                      background: { ...localStyle.background, opacity: value / 100 }
                    })}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} className="px-6">
            Cancel
          </Button>
          <Button onClick={handleApply} className="px-6">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}