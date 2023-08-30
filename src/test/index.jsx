import React from "react"

import get from "lodash/get"

import config from "./config.json"

import { Protocol, PMTiles } from './pmtiles/index.ts';

import {
  AvlMap,
  AvlLayer,
  getColorRange,
  useTheme,
  Input,
  Button
} from "~/avl-map-2/src"

import { useFakelor } from "~/Fakelor"

const PMTilesProtocol = {
  type: "pmtiles",
  protocolInit: maplibre => {
    const protocol = new Protocol();
    maplibre.addProtocol("pmtiles", protocol.tile);
    return protocol;
  },
  sourceInit: (protocol, source, maplibreMap) => {
    const p = new PMTiles(source.url);
    protocol.add(p);
  }
}

const Test = () => {
  const Layers = React.useMemo(() => [new TestLayer(), new CountyLayer()], []);

  const [props, setProps] = React.useState({ prop1: 1, prop2: 2 });

  const propper = React.useCallback(() => {
    const prop1 = Math.floor(Math.random() * 25);
    const prop2 = Math.floor(Math.random() * 25);
    setProps({ prop1, prop2 });
  }, []);

  React.useEffect(() => {
    propper();
  }, [propper]);

  const layerProps = React.useMemo(() => ({ test: { ...props, propper } }), [props, propper]);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <AvlMap accessToken={ config.MAPBOX_TOKEN }
        mapName="My Test Map"
        layers={ Layers }
        layerProps={ layerProps }
        mapOptions={ {
          navigationControl: false,
          protocols: [PMTilesProtocol]
        } }
        mapActions={ ["go-home", "reset-view", "navigation-controls"] }
        leftSidebar={ {
          startOpen: true,
          Panels: [
            "LayersPanel",
            { icon: "fa fa-smile",
              Panel: MySmileyPanel
            },
            "LegendPanel",
            "StylesPanel"
          ]
        } }
        legend={ {
          type: "threshold",
          domain: [1, 2, 5, 10, 25, 50],
          range: getColorRange(7, "BrBG"),
          isActive: true,
          name: "Test Legend",
          format: ",.1f"
        } }/>
    </div>
  )
}
export default Test;

const MyRenderComponent = props => {

  const {
    layer, layerProps, layerState,
    updateLayerState,
    MapActions
  } = props;

  const { prop1, prop2 } = layerProps;

  const updateState = React.useCallback(v => {
    updateLayerState({ test: v })
  }, [updateLayerState]);

  React.useEffect(() => {
    MapActions.startLayerLoading(layer.id);
    setTimeout(MapActions.stopLayerLoading, 5000, layer.id)
  }, [MapActions.startLayerLoading, MapActions.stopLayerLoading, layer.id]);

  return (
    <div className="top-0 left-0 absolute">
      <div className="pointer-events-auto w-80 h-40 bg-gray-100 p-1 rounded">
        <div className="p-1 h-full rounded border border-current flex flex-col">
          <div className="font-bold flex-1">
            I am a crappy layer render example.<br />
            Prop 1: { prop1 }<br />
            Prop 2: { prop2 }
          </div>
          <div className="text-black">
            <Input type="text"
              value={ get(layerState, "test", "") }
              onChange={ updateState }/>
          </div>
        </div>
      </div>
    </div>
  );
}

const MyFilterWrapper = Component => {
  return ({ value, prevValue, ...props }) => {
    const [options, setOptions] = React.useState([]);
    React.useEffect(() => {
      const options = [
        { name: "Option 1", value: "option-1" },
        { name: "Option 2", value: "option-2" },
        { name: "Option 3", value: "option-3" },
        { name: "Option 4", value: "option-4" },
        { name: "Option 5", value: "option-5" }
      ]
      setOptions(options);
    }, []);
    React.useEffect(() => {
      console.log("FILTER CHANGED:", prevValue, "< PREV VALUE | VALUE >", value);
    }, [value, prevValue]);
    return (
      <Component { ...props }
        value={ value }
        prevValue={ prevValue }
        options={ options }/>
    )
  }
}
const MyFakeFilter = () => {
  const theme = useTheme();
  return (
    <div className={ `px-2 py-1 rounded outline outline-1 ${ theme.outline }` }>
      I DO NOTHING!!!
    </div>
  )
}
const MyDumbfilter = ({ layer }) => {
  const onClick = React.useCallback(() => {
    layer.testFunc("some", "fake", "args", "!!!");
  }, [layer]);
  return (
    <Button className="buttonBlock" onClick={ onClick }>
      Layer Test Func
    </Button>
  )
}
const MyLoadingFilter = ({ MapActions, layer, layersLoading, ...props }) => {
  const startLoading = React.useCallback(e => {
    MapActions.startLayerLoading(layer.id);
  }, [MapActions.startLayerLoading, layer.id]);
  const stopLoading = React.useCallback(e => {
    MapActions.stopLayerLoading(layer.id);
  }, [MapActions.stopLayerLoading, layer.id]);
  const loading = get(layersLoading, [layer.id, "loading"], 0)
  return (
    <div>
      <div className="grid grid-cols-2 gap-1">
        <Button className="button flex-1"
          onClick={ startLoading }
        >
          start
        </Button>
        <Button className="button flex-1"
          onClick={ stopLoading }
          disabled={ !Boolean(loading) }
        >
          stop
        </Button>
      </div>
      <div>
        Loading: { loading }
      </div>
    </div>
  )
}

const MySmileyPanel = props => {
  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="font-bold text-lg text-center">My Smiley Panel</div>
      <div className="text-9xl text-center">
        <span className="mt-20 fa-solid fa-face-smile fa-bounce"/>
      </div>
      <div className="font-bold text-lg text-center">Woohoo!!!</div>
    </div>
  )
}

const TestInfoBox = (num, text = "Test InfoBox!!!") => () => {
  const [divs, setDivs] = React.useState([]);
  React.useEffect(() => {
    const divs = [];
    for (let i = 0; i < num; ++i) {
      divs.push(i);
    }
    setDivs(divs);
  }, []);
  return (
    <div>
      { divs.map(i => <div key={ i }>{ text }</div>) }
    </div>
  )
}

const MyTestModal = props => {
  return (
    <div className="w-80">
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
      <div>?????????????????????????????????</div>
    </div>
  )
}

const MyButtonModal = props => {
  const [type, setType] = React.useState("$default");
  const [color, setColor] = React.useState("$default");
  const [size, setSize] = React.useState("$default");
  const [block, setBlock] = React.useState("$default");
  const [disabled, setDisabled] = React.useState(false);

  const [className, setClassName] = React.useState("button");
  React.useEffect(() => {
    setClassName(
      [
        "button", color, size, block, type
      ].filter(v => v !== "$default"
    ).join(""));
  }, [type, color, size, block]);

  const theme = useTheme();

  return (
    <div className="w-screen max-w-xl grid grid-cols-1 gap-1">

      <div className="grid grid-cols-5 gap-1 border-b border-current">
        <div>
          <div className={ `border-b ${ theme.border }` }>Type</div>
          <div>
            <input type="radio" id="button-default"
              group="button-type" value="$default"
              checked={ type === "$default" }
              onChange={ e => setType("$default") }/>
            <label htmlFor="button-default" className="ml-1">
              Default
            </label>
          </div>
          <div>
            <input type="radio" id="button-Text"
              group="button-type" value="Text"
              checked={ type === "Text" }
              onChange={ e => setType("Text") }/>
            <label htmlFor="button-Text" className="ml-1">
              Text
            </label>
          </div>
        </div>

        <div>
          <div className={ `border-b ${ theme.border }` }>Color</div>
          <div>
            <input type="radio" id="color-default"
              group="button-color" value="$default"
              checked={ color === "$default" }
              onChange={ e => setColor("$default") }/>
            <label htmlFor="color-default" className="ml-1">
              Default
            </label>
          </div>
          <div>
            <input type="radio" id="color-Dark"
              group="button-color" value="Dark"
              checked={ color === "Dark" }
              onChange={ e => setColor("Dark") }/>
            <label htmlFor="color-Dark" className="ml-1">
              Dark
            </label>
          </div>
          <div>
            <input type="radio" id="color-Primary"
              group="button-color" value="Primary"
              checked={ color === "Primary" }
              onChange={ e => setColor("Primary") }/>
            <label htmlFor="color-Primary" className="ml-1">
              Primary
            </label>
          </div>
          <div>
            <input type="radio" id="color-Success"
              group="button-color" value="Success"
              checked={ color === "Success" }
              onChange={ e => setColor("Success") }/>
            <label htmlFor="color-Success" className="ml-1">
              Success
            </label>
          </div>
          <div>
            <input type="radio" id="color-Info"
              group="button-color" value="Info"
              checked={ color === "Info" }
              onChange={ e => setColor("Info") }/>
            <label htmlFor="color-Info" className="ml-1">
              Info
            </label>
          </div>
          <div>
            <input type="radio" id="color-Danger"
              group="button-color" value="Danger"
              checked={ color === "Danger" }
              onChange={ e => setColor("Danger") }/>
            <label htmlFor="color-Danger" className="ml-1">
              Danger
            </label>
          </div>
        </div>

        <div>
          <div className={ `border-b ${ theme.border }` }>Size</div>
          <div>
            <input type="radio" id="size-default"
              group="button-size" value="$default"
              checked={ size === "$default" }
              onChange={ e => setSize("$default") }/>
            <label htmlFor="size-default" className="ml-1">
              Default
            </label>
          </div>
          <div>
            <input type="radio" id="size-Large"
              group="button-size" value="Large"
              checked={ size === "Large" }
              onChange={ e => setSize("Large") }/>
            <label htmlFor="size-Large" className="ml-1">
              Large
            </label>
          </div>
          <div>
            <input type="radio" id="size-Small"
              group="button-size" value="Small"
              checked={ size === "Small" }
              onChange={ e => setSize("Small") }/>
            <label htmlFor="size-Small" className="ml-1">
              Small
            </label>
          </div>
        </div>

        <div>
          <div className={ `border-b ${ theme.border }` }>Block</div>
          <div>
            <input type="radio" id="block-default"
              group="button-block" value="$default"
              checked={ block === "$default" }
              onChange={ e => setBlock("$default") }/>
            <label htmlFor="block-default" className="ml-1">
              Default
            </label>
          </div>
          <div>
            <input type="radio" id="block-Block"
              group="button-block" value="Block"
              checked={ block === "Block" }
              onChange={ e => setBlock("Block") }/>
            <label htmlFor="block-Block" className="ml-1">
              Block
            </label>
          </div>
        </div>

        <div>
          <div className={ `border-b ${ theme.border }` }>Disabled</div>
          <div>
            <input type="radio" id="enabled"
              group="button-block" value={ false }
              checked={ disabled === false }
              onChange={ e => setDisabled(false) }/>
            <label htmlFor="enabled" className="ml-1">
              Enabled
            </label>
          </div>
          <div>
            <input type="radio" id="disabled"
              group="button-block" value={ true }
              checked={ disabled === true }
              onChange={ e => setDisabled(true) }/>
            <label htmlFor="disabled" className="ml-1">
              Disabled
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button className={ className } disabled={ disabled }>
          { className }
        </Button>
      </div>
    </div>
  )
}

const getMyModalFilter = modalId => ({ MapActions, openedModals }) => {
  const { openModal, closeModal } = MapActions;
  const toggleModal = React.useCallback(() => {
    const isOpen = openedModals.reduce((a, c) => {
      return a || ((c.layerId === "test") && (c.modalId === modalId));
    }, false);
    if (isOpen) {
      closeModal("test", modalId);
    }
    else {
      openModal("test", modalId);
    }
  }, [openModal, closeModal, openedModals])
  return (
    <div>
      <Button className="buttonBlock" onClick={ toggleModal }>
        toggle "{ modalId }"
      </Button>
    </div>
  )
}

const PropsInfoBox = ({ layerProps, layerState, layer }) => {
  const [prop1, prop2] = React.useMemo(() => {
    return [
      layerProps["test"]["prop1"],
      layerProps["test"]["prop2"]
    ]
  }, [layerProps["test"]]);
  const state = React.useMemo(() => {
    return layerState["test"]["test"]
  }, [layerState]);
  const onClick = React.useCallback(() => {
    layer.testFunc("Some", "dumb", "args", "???");
  }, [layer.testFunc]);
  return (
    <div>
      <div>Prop 1: { prop1 }</div>
      <div>Prop 2: { prop2 }</div>
      <div>State: { state }</div>
      <div>
        <Button onClick={ onClick } className="buttonBlock">
          Layer Test Func
        </Button>
      </div>
    </div>
  )
}

const TestDynamicLayerRenderComponent = ({ layer }) => {
  return (
    <div className="top-0 right-0 absolute">
      <div className="pointer-events-auto w-80 h-40 bg-gray-100 p-1 rounded">
        <div className="p-1 h-full rounded border border-current flex items-center justify-center">
          { layer.name }
        </div>
      </div>
    </div>
  )
}

class TestDynamicLayer extends AvlLayer {
  RenderComponent = TestDynamicLayerRenderComponent
  filters = {
    "fake-filter": {
      name: "My Fake Filter",
      Component: MyFakeFilter
    }
  }
}

const getLayerActionWrapper = (name, id = null) => Component =>
  ({ activeLayers, inactiveLayers, ...props }) => {
    const wasCreated = React.useMemo(() => {
      return [...activeLayers, ...inactiveLayers]
        .reduce((a, c) => {
          return a || (c.id === id)
        }, false);
    }, [activeLayers, inactiveLayers]);
    const action = React.useCallback((layer, MapActions) => {
      if (wasCreated) {
        MapActions.destroyDynamicLayer(id);
      }
      else {
        MapActions.createDynamicLayer(new TestDynamicLayer({ id, name }));
      }
    }, [wasCreated]);
    return (
      <Component { ...props }
        icon={ wasCreated ? "fa fa-trash" : "fa fa-plus" }
        action={ action }/>
    )
  }

class TestLayer extends AvlLayer {
  id = "test";
  name = "My Test Layer";
  startState = { test: "START STATE", counties: [] };
  RenderComponent = MyRenderComponent;
  loadingIndicator = {
    icon: "fa-solid fa-smile",
    color: "text-red-500"
  }
  testFunc(...args) {
    console.log("TEST FUNC ARGS:", ...args);
    this.props.propper();
  }
  onClick = {
    layers: ["maplibreMap"],
    callback: function(layerId, features, lngLat, point) {
      this.testFunc(layerId, features, lngLat, point);
    }
  }
  onHover = {
    layers: ["npmrds", "pmtiles-test"],
    isPinnable: true,
    callback: function(layerId, features, lngLat, point) {
      return [layerId, features.map(f => f.properties), lngLat];
    }
  }
  onBoxSelect = {
    layers: ["npmrds"],
    callback: (...args) => {
      console.log("ON BOX SELECT:", ...args);
    }
  }
  infoBoxes = [
    { Component: PropsInfoBox,
      Header: "Props Info Box"
    },
    { Component: TestInfoBox(15),
      startOpen: false,
      Header: props => (
        <div>
          I'm a Header Component
        </div>
      )
    },
    { Component: TestInfoBox(5, "I have no header!!!")
    },
    { Header: "I'm a Header",
      Component: TestInfoBox(15),
      startOpen: false
    }
  ]
  layerActions = [
    { icon: "fa fa-smile",
      action: layer => { layer.testFunc("Map", "Action", "Click"); }
    },
    { wrapper: getLayerActionWrapper("Test Dynamic Layer with ID", "test-dynamic-layer") },
    { wrapper: getLayerActionWrapper("Test Dynamic Layer without ID") }
  ]
  modals = {
    "test-modal-1": {
      Component: MyTestModal,
      Header: "Test Modal Header 1"
    },
    "test-modal-2": {
      Component: MyTestModal,
      Header: "Test Modal Header 2"
    },
    "button-modal": {
      Component: MyButtonModal,
      Header: "Buttons!!!"
    }
  }
  filters = {
    "test-filter": {
      name: "Test Filter",
      wrapper: MyFilterWrapper,
      type: "select",
      options: [],
      value: [],
      isMulti: true,
      displayAccessor: o => o.name,
      valueAccessor: o => o.value
    },
    "fake-filter": {
      name: "My Fake Filter",
      Component: MyFakeFilter
    },
    "unknown-filter": {
      name: "My Unknown Filter",
      type: "unknown"
    },
    "dumb-filter": {
      name: "My Dumb Filter",
      Component: MyDumbfilter
    },
    "loading-filter": {
      name: "My Loading Filter",
      Component: MyLoadingFilter
    },
    "modal-filter-1": {
      name: "My Modal 1 filter",
      Component: getMyModalFilter("test-modal-1")
    },
    "modal-filter-2": {
      name: "My Modal 2 filter",
      Component: getMyModalFilter("test-modal-2")
    },
    "button-modal-filter": {
      name: "Button Modal Toggle",
      Component: getMyModalFilter("button-modal")
    }
  }
  sources = [
    { id: "npmrds",
      source: {
        type: "vector",
        url: "https://tiles.availabs.org/data/npmrds.json"
      }
    },
    { id: "pmtiles-test",
      protocol: "pmtiles",
      source: {
        type: "vector",
        url: "pmtiles:///pan_s609_v1228_1693238224553.pmtiles"
      }
    }
  ]
  layers = [
    { id: "npmrds",
      source: "npmrds",
      "source-layer": "npmrds_2020",
      type: "line",
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#008",
          ["boolean", ["feature-state", "select"], false],
          "#808",
          "#800"
        ],
        "line-width": 4
      }
    },
    { "id": "pmtiles-test",
      "type": "circle",
      "paint": {
        "circle-color": "blue",
        "circle-radius": 6
      },
      "source": "pmtiles-test",
      "source-layer": "s609_v1228"
    }
  ]
}

const MyCountyRenderComponent = props => {
  const {
    startLayerLoading,
    stopLayerLoading
  } = props;

  const { fakelor } = useFakelor();

  React.useEffect(() => {
    startLayerLoading();
    fakelor.get(["these", "are", "fake", "params"])
      .then(() => stopLayerLoading())
  }, [fakelor, startLayerLoading, stopLayerLoading]);

  return null;
}

const MyCountyOpacityFilter = ({ onChange, value, maplibreMap, resourcesLoaded, layer }) => {

  const isLoaded = get(resourcesLoaded, layer.id, false);
  React.useEffect(() => {
    if (!isLoaded) return;
    maplibreMap.setPaintProperty("counties", "fill-opacity", value);
  }, [maplibreMap, value, isLoaded]);

  const doOnChange = React.useCallback(e => {
    const value = +e.target.value;
    onChange(value);
  }, [onChange, maplibreMap]);

  const [hasFocus, setHasFocus] = React.useState(false);
  const onFocus = React.useCallback(() => {
    setHasFocus(true);
  }, []);
  const onBlur = React.useCallback(() => {
    setHasFocus(false);
  }, []);

  const theme = useTheme();

  return (
    <div
      className={ `
        px-2 pt-1 pb-0 ${ theme.bgInput } rounded w-full cursor-pointer
        ${ hasFocus ?
            "outline-1 outline outline-current" :
            "hover:outline-1 hover:outline hover:outline-gray-300"
        }
      ` }
    >
      <input type="range" list="values"
        min={ 0.0 } max={ 1.0 } step="any"
        className="w-full cursor-pointer"
        value={ value }
        onChange={ doOnChange }
        onFocus={ onFocus }
        onBlur={ onBlur }/>
      <datalist id="values">
        <option value="0.0" />
        <option value="0.25" />
        <option value="0.50" />
        <option value="0.75" />
        <option value="1.00" />
      </datalist>
    </div>
  )
}
const MyCountyFilterWrapper = Filter => props => {
  const {
    layer,
    maplibreMap,
    MapActions,
    resourcesLoaded,
    onChange,
    value
  } = props;

  const [options, setOptions] = React.useState([]);

  const { fakelor, fakelorCache } = useFakelor();

  React.useEffect(() => {
    MapActions.startLayerLoading(layer.id);
    fakelor.get(["these", "are", "fake", "params"])
      .then(() => MapActions.stopLayerLoading(layer.id))
  }, [fakelor, MapActions.startLayerLoading, MapActions.stopLayerLoading, layer.id]);

  React.useEffect(() => {
    const counties = get(fakelorCache, "counties", {});
    const options = Object.keys(counties)
      .map(geoid => ({ geoid, name: counties[geoid] }));
    setOptions(options);
  }, [fakelorCache]);

  const isLoaded = get(resourcesLoaded, layer.id, false);
  React.useEffect(() => {
    if (!maplibreMap) return;
    if (!isLoaded) return;
    maplibreMap.setFilter("counties", ["in", ["get", "geoid"], ["literal", value]]);
  }, [maplibreMap, value, isLoaded]);

  React.useEffect(() => {
    if (!isLoaded) return;
    if (window.localStorage) {
      const value = JSON.parse(window.localStorage.getItem("counties-value"));
      if (value && value.length) {
        MapActions.updateFilter(layer, "counties", value);
      }
    }
  }, [layer, isLoaded, MapActions.updateFilter]);

  const doOnChange = React.useCallback(value => {
    onChange(value);
    if (value.length && window.localStorage) {
      window.localStorage.setItem("counties-value", JSON.stringify(value));
    }
  }, [onchange]);

  return (
    <Filter { ...props }
      options={ options }
      onChange={ doOnChange }/>
  )
}
const MyCountyHoverComp = ({ data = [null] }) => {
  const { fakelorCache } = useFakelor();
  const [geoid] = data;
  const theme = useTheme();
  return (
    <div className={ `${ theme.bg } px-2 py-1 rounded` }>
      { get(fakelorCache, ["counties", geoid], "loading...") } ({ geoid })
    </div>
  )
}

class CountyLayer extends AvlLayer {
  id = "county";
  name = "County Layer";
  RenderComponent = MyCountyRenderComponent;
  onHover = {
    layers: ["counties"],
    Component: MyCountyHoverComp,
    callback: function(layerId, features) {
      return features.map(f => get(f, ["properties", "geoid"], "unknown"))
    }
  }
  filters = {
    counties: {
      name: "Counties",
      wrapper: MyCountyFilterWrapper,
      type: "select",
      options: [],
      value: [],
      displayAccessor: o => o.name,
      valueAccessor: o => o.geoid,
      isMulti: true,
      searchable: true
    },
    opacity: {
      name: "Opacity",
      Component: MyCountyOpacityFilter,
      value: 0.5
    }
  }
  sources = [
    { id: "counties",
      source: {
        type: "vector",
        url: "https://tiles.availabs.org/data/tl_2020_36_county.json"
      }
    }
  ]
  layers = [
    { id: "counties",
      source: "counties",
      "source-layer": "tl_2020_us_county",
      type: "fill",
      filter: ["in", ["get", "geoid"], "none"],
      paint: {
        "fill-color": ["case", ["boolean", ["feature-state", "hover"], false], "#808", "#008"]
      }
    }
  ]
}
