================
infiniband-diags
================

----------------------------------
Diagnostics for InfiniBand Fabrics
----------------------------------

:Date: 2017-08-21
:Manual section: 8
:Manual group: Open IB Diagnostics

DESCRIPTION
===========

infiniband-diags is a set of utilities designed to help configure, debug, and
maintain infiniband fabrics.  Many tools and utilities are provided.  Some with
similar functionality.

The base utilities use directed route MAD's to perform their operations.  They
may therefore work even in unconfigured subnets.  Other, higher level
utilities, require LID routed MAD's and to some extent SA/SM access.


THE USE OF SMPs (QP0)
=====================

Many of the tools in this package rely on the use of SMPs via QP0 to acquire
data directly from the SMA.  While this mode of operation is not technically in
compliance with the InfiniBand specification, practical experience has found
that this level of diagnostics is valuable when working with a fabric which is
broken or only partially configured.  For this reason many of these tools may
require the use of an MKey or operation from Virtual Machines may be restricted
for security reasons.


COMMON OPTIONS
==============

Most OpenIB diagnostics take some of the following common flags. The exact list
of supported flags per utility can be found in the documentation for those
commands.


Addressing Flags
----------------

The -D and -G option have two forms:

.. Define the common option -D for Directed routes

**-D, --Direct**     The address specified is a directed route
::

    Examples:
       [options] -D [options] "0"          # self port
       [options] -D [options] "0,1,2,1,4"  # out via port 1, then 2, ...

       (Note the second number in the path specified must match the port being
       used.  This can be specified using the port selection flag '-P' or the
       port found through the automatic selection process.)



.. Define the common option -D for Directed routes

**-D, --Direct <dr_path>**     The address specified is a directed route
::

    Examples:
       -D "0"          # self port
       -D "0,1,2,1,4"  # out via port 1, then 2, ...

       (Note the second number in the path specified must match the port being
       used.  This can be specified using the port selection flag '-P' or the
       port found through the automatic selection process.)



.. Define the common option -G

**-G, --Guid**     The address specified is a Port GUID


.. Define the common option -G

**--port-guid, -G <port_guid>**  Specify a port_guid


.. Define the common option -L

**-L, --Lid**   The address specified is a LID


.. Define the common option -s

**-s, --sm_port <smlid>**     use 'smlid' as the target lid for SA queries.


Port Selection flags
--------------------

.. Define the common option -C

**-C, --Ca <ca_name>**    use the specified ca_name.


.. Define the common option -P

**-P, --Port <ca_port>**    use the specified ca_port.


.. Define the common option -Y

**-Y, --pkey-idx <idx>**
  P_Key table index (0-65535, default 0) used for the outgoing SA/GMP MADs.
  SMP (SMI directed-route/LID-routed) MADs always use P_Key index 0.

.. Explanation of local port selection

Local port Selection
--------------------

Multiple port/Multiple CA support: when no IB device or port is specified
(see the "local umad parameters" below), the libibumad library
selects the port to use by the following criteria:

	1. the first port that is ACTIVE.
	2. if not found, the first port that is UP (physical link up).

	If a port and/or CA name is specified, the libibumad library attempts
	to fulfill the user request, and will fail if it is not possible.

	For example:

        ::

	    ibaddr                 # use the first port (criteria #1 above)
	    ibaddr -C mthca1       # pick the best port from "mthca1" only.
	    ibaddr -P 2            # use the second (active/up) port from the first available IB device.
	    ibaddr -C mthca0 -P 2  # use the specified port only.


Debugging flags
---------------

.. Define the common option -d

-d
        raise the IB debugging level.
        May be used several times (-ddd or -d -d -d).


.. Define the common option -e

-e      show send and receive errors (timeouts and others)

.. Define the common option -h

**-h, --help**      show the usage message


.. Define the common option -v

**-v, --verbose**
        increase the application verbosity level.
        May be used several times (-vv or -v -v -v)


.. Define the common option -V

**-V, --version**     show the version info.


Configuration flags
-------------------

.. Define the common option -t

**-t, --timeout <timeout_ms>** override the default timeout for the solicited mads.


.. Define the common option -z

**--outstanding_smps, -o <val>**
        Specify the number of outstanding SMP's which should be issued during the scan

        Default: 2


.. Define the common option --node-name-map

**--node-name-map <node-name-map>** Specify a node name map.

        This file maps GUIDs to more user friendly names.  See FILES section.


.. Define the common option -z

**--config, -z  <config_file>** Specify alternate config file.

        Default: @IBDIAG_CONFIG_PATH@/ibdiag.conf


COMMON FILES
============

The following config files are common amongst many of the utilities.

.. Common text for the config file

CONFIG FILE
-----------

@IBDIAG_CONFIG_PATH@/ibdiag.conf

A global config file is provided to set some of the common options for all
tools.  See supplied config file for details.


.. Common text to describe the node name map file.

NODE NAME MAP FILE FORMAT
-------------------------

The node name map is used to specify user friendly names for nodes in the
output.  GUIDs are used to perform the lookup.

This functionality is provided by the opensm-libs package.  See **opensm(8)**
for the file location for your installation.

**Generically:**

::

   # comment
   <guid> "<name>"

**Example:**

::

   # IB1
   # Line cards
   0x0008f104003f125c "IB1 (Rack 11 slot 1   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f125d "IB1 (Rack 11 slot 1   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f10d2 "IB1 (Rack 11 slot 2   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f10d3 "IB1 (Rack 11 slot 2   ) ISR9288/ISR9096 Voltaire sLB-24D"
   0x0008f104003f10bf "IB1 (Rack 11 slot 12  ) ISR9288/ISR9096 Voltaire sLB-24D"
   
   # Spines
   0x0008f10400400e2d "IB1 (Rack 11 spine 1   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e2e "IB1 (Rack 11 spine 1   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e2f "IB1 (Rack 11 spine 1   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e31 "IB1 (Rack 11 spine 2   ) ISR9288 Voltaire sFB-12D"
   0x0008f10400400e32 "IB1 (Rack 11 spine 2   ) ISR9288 Voltaire sFB-12D"
   
   # GUID   Node Name
   0x0008f10400411a08 "SW1  (Rack  3) ISR9024 Voltaire 9024D"
   0x0008f10400411a28 "SW2  (Rack  3) ISR9024 Voltaire 9024D"
   0x0008f10400411a34 "SW3  (Rack  3) ISR9024 Voltaire 9024D"
   0x0008f104004119d0 "SW4  (Rack  3) ISR9024 Voltaire 9024D"


.. Common text to describe the Topology file.

TOPOLOGY FILE FORMAT
--------------------

The topology file format is human readable and largely intuitive.
Most identifiers are given textual names like vendor ID (vendid), device ID
(device ID), GUIDs of various types (sysimgguid, caguid, switchguid, etc.).
PortGUIDs are shown in parentheses ().  For switches, this is shown on the
switchguid line.  For CA and router ports, it is shown on the connectivity
lines.  The IB node is identified followed by the number of ports and a quoted
the node GUID.  On the right of this line is a comment (#) followed by the
NodeDescription in quotes.  If the node is a switch, this line also contains
whether switch port 0 is base or enhanced, and the LID and LMC of port 0.
Subsequent lines pertaining to this node show the connectivity.   On the
left is the port number of the current node.  On the right is the peer node
(node at other end of link). It is identified in quotes with nodetype
followed by - followed by NodeGUID with the port number in square brackets.
Further on the right is a comment (#).  What follows the comment is
dependent on the node type.  If it it a switch node, it is followed by
the NodeDescription in quotes and the LID of the peer node.  If it is a
CA or router node, it is followed by the local LID and LMC and then
followed by the NodeDescription in quotes and the LID of the peer node.
The active link width and speed are then appended to the end of this
output line.

An example of this is:

::

   #
   # Topology file: generated on Tue Jun  5 14:15:10 2007
   #
   # Max of 3 hops discovered
   # Initiated from node 0008f10403960558 port 0008f10403960559
   
   Non-Chassis Nodes
   
   vendid=0x8f1
   devid=0x5a06
   sysimgguid=0x5442ba00003000
   switchguid=0x5442ba00003080(5442ba00003080)
   Switch  24 "S-005442ba00003080"         # "ISR9024 Voltaire" base port 0 lid 6 lmc 0
   [22]    "H-0008f10403961354"[1](8f10403961355)         # "MT23108 InfiniHost Mellanox Technologies" lid 4 4xSDR
   [10]    "S-0008f10400410015"[1]         # "SW-6IB4 Voltaire" lid 3 4xSDR
   [8]     "H-0008f10403960558"[2](8f1040396055a)         # "MT23108 InfiniHost Mellanox Technologies" lid 14 4xSDR
   [6]     "S-0008f10400410015"[3]         # "SW-6IB4 Voltaire" lid 3 4xSDR
   [12]    "H-0008f10403960558"[1](8f10403960559)         # "MT23108 InfiniHost Mellanox Technologies" lid 10 4xSDR
   
   vendid=0x8f1
   devid=0x5a05
   switchguid=0x8f10400410015(8f10400410015)
   Switch  8 "S-0008f10400410015"          # "SW-6IB4 Voltaire" base port 0 lid 3 lmc 0
   [6]     "H-0008f10403960984"[1](8f10403960985)         # "MT23108 InfiniHost Mellanox Technologies" lid 16 4xSDR
   [4]     "H-005442b100004900"[1](5442b100004901)        # "MT23108 InfiniHost Mellanox Technologies" lid 12 4xSDR
   [1]     "S-005442ba00003080"[10]                # "ISR9024 Voltaire" lid 6 1xSDR
   [3]     "S-005442ba00003080"[6]         # "ISR9024 Voltaire" lid 6 4xSDR
   
   vendid=0x2c9
   devid=0x5a44
   caguid=0x8f10403960984
   Ca      2 "H-0008f10403960984"          # "MT23108 InfiniHost Mellanox Technologies"
   [1](8f10403960985)     "S-0008f10400410015"[6]         # lid 16 lmc 1 "SW-6IB4 Voltaire" lid 3 4xSDR
   
   vendid=0x2c9
   devid=0x5a44
   caguid=0x5442b100004900
   Ca      2 "H-005442b100004900"          # "MT23108 InfiniHost Mellanox Technologies"
   [1](5442b100004901)     "S-0008f10400410015"[4]         # lid 12 lmc 1 "SW-6IB4 Voltaire" lid 3 4xSDR
   
   vendid=0x2c9
   devid=0x5a44
   caguid=0x8f10403961354
   Ca      2 "H-0008f10403961354"          # "MT23108 InfiniHost Mellanox Technologies"
   [1](8f10403961355)     "S-005442ba00003080"[22]                # lid 4 lmc 1 "ISR9024 Voltaire" lid 6 4xSDR
   
   vendid=0x2c9
   devid=0x5a44
   caguid=0x8f10403960558
   Ca      2 "H-0008f10403960558"          # "MT23108 InfiniHost Mellanox Technologies"
   [2](8f1040396055a)     "S-005442ba00003080"[8]         # lid 14 lmc 1 "ISR9024 Voltaire" lid 6 4xSDR
   [1](8f10403960559)     "S-005442ba00003080"[12]                # lid 10 lmc 1 "ISR9024 Voltaire" lid 6 1xSDR


When grouping is used, IB nodes are organized into chassis which are
numbered. Nodes which cannot be determined to be in a chassis are
displayed as "Non-Chassis Nodes".  External ports are also shown on the
connectivity lines.


Utilities list
==============

Basic fabric connectivity
-------------------------

	See: ibnetdiscover, iblinkinfo

Node information
----------------

	See: ibnodes, ibswitches, ibhosts, ibrouters

Port information
----------------

	See: ibportstate, ibaddr

Switch Forwarding Table info
----------------------------

	See: ibtracert, ibroute, dump_lfts, dump_mfts, check_lft_balance, ibfindnodesusing

Performance counters
--------------------

	See: ibqueryerrors, perfquery

Local HCA info
--------------

	See: ibstat, ibstatus

Connectivity check
------------------

	See: ibping, ibsysstat

Low level query tools
---------------------

	See: smpquery, smpdump, saquery, sminfo

Fabric verification tools
-------------------------

        See: ibidsverify


Backwards compatibility scripts
===============================

The following scripts have been identified as redundant and/or lower performing
as compared to the above scripts.  They are provided as legacy scripts when
--enable-compat-utils is specified at build time.

ibcheckerrors, ibclearcounters, ibclearerrors, ibdatacounters
ibchecknet, ibchecknode, ibcheckport, ibcheckportstate,
ibcheckportwidth, ibcheckstate, ibcheckwidth, ibswportwatch,
ibprintca, ibprintrt, ibprintswitch, set_nodedesc.sh


AUTHORS
=======

Ira Weiny
        < ira.weiny@intel.com >
