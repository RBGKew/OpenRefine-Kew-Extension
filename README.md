# Kew OpenRefine extension

## Introduction

This extension is based on the Freebase extension.  It uses [Metaweb Query Language](http://wiki.freebase.com/wiki/MQL)
(MQL) to query various Kew web services, thus incorporating Kew data into another dataset.

## Installation

**TBC: A Kew-produced build of OpenRefine will include this extension.**

## Installation from source

* Clone the OpenRefine source, see http://www.openrefine.org/
* Clone the extension source within the OpenRefine source so it becomes /extension/kew
* Modify /extensions/build.xml to add kew to build and clean:

```
<target name="build">
	<echo message="Building extensions" />
	<ant dir="sample/" target="build" />
	<ant dir="jython/" target="build" />
	<ant dir="freebase/" target="build" />
	<ant dir="gdata/" target="build" />
	<ant dir="kew/" target="build" />
</target>

<target name="clean">
	<echo message="cleaning extensions" />
	<ant dir="sample/" target="clean" />
	<ant dir="jython/" target="clean" />
	<ant dir="freebase/" target="clean" />
	<ant dir="gdata/" target="clean" />
	<ant dir="kew/" target="clean" />
</target>
```

* Run ./refine clean
* Run ./refine build
* Run ./refine start

https://github.com/RBGKew/OpenRefine-Kew-Extension
