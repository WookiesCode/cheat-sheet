========
smpquery
========

---------------------------------------------
query InfiniBand subnet management attributes
---------------------------------------------

:Date: 2017-08-21
:Manual section: 8
:Manual group: Open IB Diagnostics

SYNOPSIS
========

smpquery [options] <op> <dest dr_path|lid|guid> [op params]

DESCRIPTION
===========

smpquery allows a basic subset of standard SMP queries including the following:
node info, node description, switch info, port info. Fields are displayed in
human readable format.

OPTIONS
=======

Current supported operations (case insensitive) and their parameters:


::

        Nodeinfo (NI) <addr>

        Nodedesc (ND) <addr>

        Portinfo (PI) <addr> [<portnum>]     # default port is zero

        PortInfoExtended (PIE) <addr> [<portnum>]

        Switchinfo (SI) <addr>

        PKeyTable (PKeys) <addr> [<portnum>]

        SL2VLTable (SL2VL) <addr> [<portnum>]

        VLArbitration (VLArb) <addr> [<portnum>]

        GUIDInfo (GI) <addr>

        MlnxExtPortInfo (MEPI) <addr> [<portnum>]  # default port is zero


**-c, --combined**
        Use Combined route address argument ``<lid> <DR_Path>``

**-x, --extended**
        Set SMSupportsExtendedSpeeds bit 31 in AttributeModifier
        (only impacts PortInfo queries).

.. Define the common option -K

**-K, --show_keys**
  show security keys (mkey, smkey, etc.) associated with the request.

Addressing Flags
----------------

.. Define the common option -D for Directed routes

**-D, --Direct**     The address specified is a directed route
::

    Examples:
       [options] -D [options] "0"          # self port
       [options] -D [options] "0,1,2,1,4"  # out via port 1, then 2, ...

       (Note the second number in the path specified must match the port being
       used.  This can be specified using the port selection flag '-P' or the
       port found through the automatic selection process.)



.. Define the common option -G

**-G, --Guid**     The address specified is a Port GUID


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


.. Define the common option --node-name-map

**--node-name-map <node-name-map>** Specify a node name map.

        This file maps GUIDs to more user friendly names.  See FILES section.


.. Define the common option -y

**-y, --m_key <key>**
        use the specified M_key for requests. If non-numeric value (like 'x')
        is specified then a value will be prompted for.


.. Define the common option -z

**--config, -z  <config_file>** Specify alternate config file.

        Default: @IBDIAG_CONFIG_PATH@/ibdiag.conf


FILES
=====

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


EXAMPLES
========

::

        smpquery portinfo 3 1                     # portinfo by lid, with port modifier
        smpquery -G switchinfo 0x2C9000100D051 1  # switchinfo by guid
        smpquery -D nodeinfo 0                    # nodeinfo by direct route
        smpquery -c nodeinfo 6 0,12               # nodeinfo by combined route

SEE ALSO
========

smpdump (8)

AUTHOR
======

Hal Rosenstock
        < hal@mellanox.com >
